// security/security-utils.ts
"use client";

import CryptoJS from 'crypto-js';

interface MultiSigWallet {
  address: string;
  requiredSignatures: number;
  totalSigners: number;
  signers: string[];
  pendingTransactions: PendingTransaction[];
}

interface PendingTransaction {
  id: string;
  to: string;
  amount: number;
  data?: string;
  signatures: Signature[];
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'executed' | 'expired' | 'cancelled';
}

interface Signature {
  signer: string;
  signature: string;
  timestamp: Date;
}

interface ReviewAuthenticity {
  reviewId: string;
  authorAddress: string;
  businessId: string;
  contentHash: string;
  timestamp: Date;
  deviceFingerprint: string;
  ipAddress: string;
  geoLocation: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  biometricHash?: string;
  authenticity: {
    score: number;
    factors: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}

interface FraudDetectionResult {
  isFraudulent: boolean;
  confidence: number;
  riskFactors: string[];
  actionRequired: 'none' | 'verify' | 'block' | 'investigate';
  details: {
    ipReputation: number;
    deviceTrust: number;
    behaviorAnalysis: number;
    contentAnalysis: number;
    networkAnalysis: number;
  };
}

interface RateLimitRule {
  key: string;
  limit: number;
  window: number;
  burst?: number;
  penalty?: number;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'transaction' | 'review' | 'suspicious' | 'fraud_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details: Record<string, any>;
  blocked: boolean;
}

class SecurityManager {
  private rateLimits: Map<string, { count: number; resetTime: number; violations: number }> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private trustedIPs: Set<string> = new Set();
  private blockedIPs: Set<string> = new Set();
  private deviceFingerprints: Map<string, { trustScore: number; lastSeen: Date; riskFactors: string[] }> = new Map();

  async createMultiSigWallet(signers: string[], requiredSignatures: number): Promise<MultiSigWallet> {
    if (requiredSignatures > signers.length || requiredSignatures < 1) {
      throw new Error('Invalid required signatures count');
    }

    const walletAddress = this.generateWalletAddress(signers, requiredSignatures);
    
    return {
      address: walletAddress,
      requiredSignatures,
      totalSigners: signers.length,
      signers: [...signers],
      pendingTransactions: []
    };
  }

  async proposeTransaction(
    wallet: MultiSigWallet,
    to: string,
    amount: number,
    proposer: string,
    data?: string
  ): Promise<PendingTransaction> {
    if (!wallet.signers.includes(proposer)) {
      throw new Error('Proposer is not a wallet signer');
    }

    const transaction: PendingTransaction = {
      id: this.generateTransactionId(),
      to,
      amount,
      data,
      signatures: [],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending'
    };

    wallet.pendingTransactions.push(transaction);
    return transaction;
  }

  async signTransaction(
    wallet: MultiSigWallet,
    transactionId: string,
    signer: string,
    signature: string
  ): Promise<boolean> {
    if (!wallet.signers.includes(signer)) {
      throw new Error('Signer is not authorized');
    }

    const transaction = wallet.pendingTransactions.find(tx => tx.id === transactionId);
    if (!transaction || transaction.status !== 'pending') {
      throw new Error('Transaction not found or not pending');
    }

    if (transaction.expiresAt < new Date()) {
      transaction.status = 'expired';
      throw new Error('Transaction has expired');
    }

    if (transaction.signatures.some(sig => sig.signer === signer)) {
      throw new Error('Signer has already signed this transaction');
    }

    transaction.signatures.push({
      signer,
      signature,
      timestamp: new Date()
    });

    if (transaction.signatures.length >= wallet.requiredSignatures) {
      transaction.status = 'executed';
      await this.executeTransaction(transaction);
      return true;
    }

    return false;
  }

  async verifyReviewAuthenticity(
    reviewData: {
      content: string;
      authorAddress: string;
      businessId: string;
      timestamp: Date;
    },
    context: {
      ipAddress: string;
      userAgent: string;
      deviceFingerprint: string;
      geoLocation?: { lat: number; lng: number; accuracy: number };
    }
  ): Promise<ReviewAuthenticity> {
    const contentHash = this.hashContent(reviewData.content);
    const deviceTrust = this.getDeviceTrustScore(context.deviceFingerprint);
    const ipReputation = this.getIPReputation(context.ipAddress);
    const behaviorScore = await this.analyzeBehavior(reviewData.authorAddress, context);
    
    const authenticityFactors: string[] = [];
    let score = 0.5;

    if (deviceTrust > 0.8) {
      authenticityFactors.push('trusted_device');
      score += 0.2;
    } else if (deviceTrust < 0.3) {
      authenticityFactors.push('suspicious_device');
      score -= 0.3;
    }

    if (ipReputation > 0.7) {
      authenticityFactors.push('reputable_ip');
      score += 0.15;
    } else if (ipReputation < 0.3) {
      authenticityFactors.push('suspicious_ip');
      score -= 0.25;
    }

    if (behaviorScore > 0.8) {
      authenticityFactors.push('consistent_behavior');
      score += 0.15;
    } else if (behaviorScore < 0.4) {
      authenticityFactors.push('anomalous_behavior');
      score -= 0.2;
    }

    if (context.geoLocation) {
      const locationConsistency = await this.checkLocationConsistency(
        reviewData.authorAddress,
        context.geoLocation
      );
      if (locationConsistency > 0.8) {
        authenticityFactors.push('consistent_location');
        score += 0.1;
      } else if (locationConsistency < 0.3) {
        authenticityFactors.push('suspicious_location');
        score -= 0.15;
      }
    }

    score = Math.max(0, Math.min(1, score));
    
    let riskLevel: 'low' | 'medium' | 'high';
    if (score >= 0.8) riskLevel = 'low';
    else if (score >= 0.5) riskLevel = 'medium';
    else riskLevel = 'high';

    return {
      reviewId: this.generateReviewId(),
      authorAddress: reviewData.authorAddress,
      businessId: reviewData.businessId,
      contentHash,
      timestamp: reviewData.timestamp,
      deviceFingerprint: context.deviceFingerprint,
      ipAddress: context.ipAddress,
      geoLocation: context.geoLocation || { lat: 0, lng: 0, accuracy: 0 },
      authenticity: {
        score,
        factors: authenticityFactors,
        riskLevel
      }
    };
  }

  async detectFraud(
    action: string,
    userId: string,
    context: {
      ipAddress: string;
      userAgent: string;
      deviceFingerprint: string;
      data: Record<string, any>;
    }
  ): Promise<FraudDetectionResult> {
    const ipReputation = this.getIPReputation(context.ipAddress);
    const deviceTrust = this.getDeviceTrustScore(context.deviceFingerprint);
    const behaviorScore = await this.analyzeBehavior(userId, context);
    const contentScore = this.analyzeContent(context.data);
    const networkScore = await this.analyzeNetworkPatterns(context.ipAddress, userId);

    const riskFactors: string[] = [];
    let riskScore = 0;

    if (ipReputation < 0.3) {
      riskFactors.push('suspicious_ip');
      riskScore += 0.4;
    }

    if (deviceTrust < 0.3) {
      riskFactors.push('untrusted_device');
      riskScore += 0.3;
    }

    if (behaviorScore < 0.4) {
      riskFactors.push('anomalous_behavior');
      riskScore += 0.35;
    }

    if (contentScore < 0.3) {
      riskFactors.push('suspicious_content');
      riskScore += 0.25;
    }

    if (networkScore < 0.4) {
      riskFactors.push('suspicious_network_activity');
      riskScore += 0.3;
    }

    if (this.isRateLimited(`fraud_check:${userId}:${context.ipAddress}`)) {
      riskFactors.push('rate_limited');
      riskScore += 0.2;
    }

    if (this.blockedIPs.has(context.ipAddress)) {
      riskFactors.push('blocked_ip');
      riskScore += 0.6;
    }

    const confidence = Math.min(1, riskScore);
    const isFraudulent = confidence > 0.7;

    let actionRequired: 'none' | 'verify' | 'block' | 'investigate';
    if (confidence >= 0.9) actionRequired = 'block';
    else if (confidence >= 0.7) actionRequired = 'investigate';
    else if (confidence >= 0.5) actionRequired = 'verify';
    else actionRequired = 'none';

    if (isFraudulent) {
      await this.logSecurityEvent({
        type: 'fraud_attempt',
        severity: confidence > 0.9 ? 'critical' : 'high',
        userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        details: { action, riskFactors, confidence },
        blocked: actionRequired === 'block'
      });
    }

    return {
      isFraudulent,
      confidence,
      riskFactors,
      actionRequired,
      details: {
        ipReputation,
        deviceTrust,
        behaviorAnalysis: behaviorScore,
        contentAnalysis: contentScore,
        networkAnalysis: networkScore
      }
    };
  }

  checkRateLimit(key: string, rule: RateLimitRule): boolean {
    const now = Date.now();
    const current = this.rateLimits.get(key);

    if (!current || now > current.resetTime) {
      this.rateLimits.set(key, {
        count: 1,
        resetTime: now + rule.window * 1000,
        violations: current?.violations || 0
      });
      return true;
    }

    if (current.count >= rule.limit) {
      current.violations++;
      
      if (current.violations >= 3) {
        this.applyPenalty(key, rule.penalty || 3600);
      }

      return false;
    }

    current.count++;
    return true;
  }

  isRateLimited(key: string): boolean {
    const current = this.rateLimits.get(key);
    if (!current) return false;
    
    return Date.now() <= current.resetTime && current.violations >= 3;
  }

  async detectDDoS(
    ipAddress: string,
    endpoint: string,
    requestCount: number,
    timeWindow: number
  ): Promise<{ isDDoS: boolean; severity: 'low' | 'medium' | 'high' | 'critical'; blockDuration: number }> {
    const threshold = this.getDDoSThreshold(endpoint);
    const requestRate = requestCount / (timeWindow / 1000);
    
    let isDDoS = false;
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let blockDuration = 0;

    if (requestRate > threshold.critical) {
      isDDoS = true;
      severity = 'critical';
      blockDuration = 3600;
      this.blockedIPs.add(ipAddress);
    } else if (requestRate > threshold.high) {
      isDDoS = true;
      severity = 'high';
      blockDuration = 1800;
    } else if (requestRate > threshold.medium) {
      isDDoS = true;
      severity = 'medium';
      blockDuration = 600;
    } else if (requestRate > threshold.low) {
      isDDoS = true;
      severity = 'low';
      blockDuration = 300;
    }

    if (isDDoS) {
      await this.logSecurityEvent({
        type: 'suspicious',
        severity,
        ipAddress,
        userAgent: 'Unknown',
        details: { endpoint, requestCount, timeWindow, requestRate },
        blocked: blockDuration > 0
      });
    }

    return { isDDoS, severity, blockDuration };
  }

  private generateWalletAddress(signers: string[], requiredSignatures: number): string {
    const data = signers.sort().join('') + requiredSignatures.toString();
    return 'MSW_' + CryptoJS.SHA256(data).toString().substring(0, 40);
  }

  private generateTransactionId(): string {
    return 'TX_' + CryptoJS.lib.WordArray.random(16).toString();
  }

  private generateReviewId(): string {
    return 'REV_' + CryptoJS.lib.WordArray.random(16).toString();
  }

  private hashContent(content: string): string {
    return CryptoJS.SHA256(content).toString();
  }

  private getDeviceTrustScore(fingerprint: string): number {
    const device = this.deviceFingerprints.get(fingerprint);
    return device?.trustScore || 0.5;
  }

  private getIPReputation(ipAddress: string): number {
    if (this.trustedIPs.has(ipAddress)) return 1.0;
    if (this.blockedIPs.has(ipAddress)) return 0.0;
    
    const isPrivate = this.isPrivateIP(ipAddress);
    const hasHistory = this.hasIPHistory(ipAddress);
    
    let score = 0.5;
    if (isPrivate) score += 0.2;
    if (hasHistory) score += 0.3;
    
    return Math.min(1, score);
  }

  private async analyzeBehavior(userId: string, context: any): Promise<number> {
    const recentEvents = this.securityEvents
      .filter(event => event.userId === userId)
      .filter(event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000);
    
    if (recentEvents.length === 0) return 0.5;
    
    const suspiciousEvents = recentEvents.filter(event => 
      event.severity === 'high' || event.severity === 'critical'
    );
    
    const behaviorScore = 1 - (suspiciousEvents.length / Math.max(recentEvents.length, 10));
    return Math.max(0, behaviorScore);
  }

  private analyzeContent(data: Record<string, any>): number {
    let score = 0.8;
    
    if (data.content) {
      const content = data.content.toString().toLowerCase();
      
      const spamPatterns = [
        /(.)\1{4,}/,
        /http[s]?:\/\//,
        /\b(free|win|click|buy now|limited time)\b/g,
        /[A-Z]{10,}/
      ];
      
      spamPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          score -= 0.2;
        }
      });
      
      if (content.length < 10) score -= 0.3;
      if (content.length > 2000) score -= 0.1;
    }
    
    return Math.max(0, score);
  }

  private async analyzeNetworkPatterns(ipAddress: string, userId: string): Promise<number> {
    const recentSameIPEvents = this.securityEvents
      .filter(event => event.ipAddress === ipAddress)
      .filter(event => Date.now() - event.timestamp.getTime() < 60 * 60 * 1000);
    
    const uniqueUsers = new Set(recentSameIPEvents.map(event => event.userId));
    
    if (uniqueUsers.size > 10) return 0.2;
    if (uniqueUsers.size > 5) return 0.4;
    if (uniqueUsers.size > 2) return 0.6;
    
    return 0.8;
  }

  private async checkLocationConsistency(
    userAddress: string,
    location: { lat: number; lng: number; accuracy: number }
  ): Promise<number> {
    const recentLocations = this.securityEvents
      .filter(event => event.userId === userAddress)
      .filter(event => event.details.geoLocation)
      .slice(-5);
    
    if (recentLocations.length === 0) return 0.5;
    
    let consistencyScore = 1.0;
    
    recentLocations.forEach(event => {
      const prevLocation = event.details.geoLocation;
      const distance = this.calculateDistance(
        location.lat, location.lng,
        prevLocation.lat, prevLocation.lng
      );
      
      const timeDiff = (Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60);
      const maxReasonableDistance = timeDiff * 500;
      
      if (distance > maxReasonableDistance) {
        consistencyScore -= 0.3;
      }
    });
    
    return Math.max(0, consistencyScore);
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/
    ];
    
    return privateRanges.some(range => range.test(ip));
  }

  private hasIPHistory(ipAddress: string): boolean {
    return this.securityEvents.some(event => 
      event.ipAddress === ipAddress && 
      !event.blocked &&
      Date.now() - event.timestamp.getTime() > 7 * 24 * 60 * 60 * 1000
    );
  }

  private getDDoSThreshold(endpoint: string): { low: number; medium: number; high: number; critical: number } {
    const defaults = { low: 10, medium: 50, high: 100, critical: 200 };
    
    const endpointThresholds: Record<string, typeof defaults> = {
      '/api/reviews': { low: 5, medium: 20, high: 50, critical: 100 },
      '/api/wallet': { low: 2, medium: 10, high: 25, critical: 50 },
      '/api/governance': { low: 1, medium: 5, high: 15, critical: 30 }
    };
    
    return endpointThresholds[endpoint] || defaults;
  }

  private applyPenalty(key: string, duration: number): void {
    const current = this.rateLimits.get(key);
    if (current) {
      current.resetTime = Date.now() + duration * 1000;
    }
  }

  private async executeTransaction(transaction: PendingTransaction): Promise<void> {
    console.log(`Executing transaction ${transaction.id}: ${transaction.amount} to ${transaction.to}`);
  }

  private async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      id: CryptoJS.lib.WordArray.random(8).toString(),
      timestamp: new Date()
    };
    
    this.securityEvents.push(securityEvent);
    
    if (this.securityEvents.length > 10000) {
      this.securityEvents = this.securityEvents.slice(-5000);
    }
    
    if (event.severity === 'critical' || event.severity === 'high') {
      console.warn('Security Alert:', securityEvent);
    }
  }

  getSecurityMetrics(): {
    totalEvents: number;
    criticalEvents: number;
    blockedIPs: number;
    rateLimitViolations: number;
    fraudAttempts: number;
  } {
    const now = Date.now();
    const last24h = this.securityEvents.filter(event => 
      now - event.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    return {
      totalEvents: last24h.length,
      criticalEvents: last24h.filter(e => e.severity === 'critical').length,
      blockedIPs: this.blockedIPs.size,
      rateLimitViolations: Array.from(this.rateLimits.values()).reduce((sum, limit) => sum + limit.violations, 0),
      fraudAttempts: last24h.filter(e => e.type === 'fraud_attempt').length
    };
  }

  updateDeviceTrust(fingerprint: string, trustScore: number, riskFactors: string[] = []): void {
    this.deviceFingerprints.set(fingerprint, {
      trustScore: Math.max(0, Math.min(1, trustScore)),
      lastSeen: new Date(),
      riskFactors
    });
  }

  addTrustedIP(ipAddress: string): void {
    this.trustedIPs.add(ipAddress);
    this.blockedIPs.delete(ipAddress);
  }

  blockIP(ipAddress: string): void {
    this.blockedIPs.add(ipAddress);
    this.trustedIPs.delete(ipAddress);
  }

  clearSecurityEvents(): void {
    this.securityEvents = [];
  }
}

export const securityManager = new SecurityManager();

export type {
  MultiSigWallet,
  PendingTransaction,
  ReviewAuthenticity,
  FraudDetectionResult,
  RateLimitRule,
  SecurityEvent
};