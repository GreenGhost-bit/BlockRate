    // services/external-apis.ts
"use client";

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  relevanceScore: number;
}

interface SocialProfile {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  username: string;
  followerCount?: number;
  isVerified: boolean;
  profileUrl: string;
  profileImage?: string;
}

interface LocationInsight {
  businessName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  weather: WeatherData;
  localEvents: string[];
  competitorAnalysis: {
    nearbyBusinesses: number;
    averageRating: number;
    priceComparison: 'higher' | 'similar' | 'lower';
  };
}

class ExternalAPIsService {
  private readonly GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  private readonly WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  private readonly NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  async getBusinessDetails(businessName: string, address?: string): Promise<GooglePlaceDetails | null> {
    try {
      const query = address ? `${businessName} ${address}` : businessName;
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.GOOGLE_PLACES_API_KEY}`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.results && searchData.results.length > 0) {
        const placeId = searchData.results[0].place_id;
        
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,photos,geometry,types&key=${this.GOOGLE_PLACES_API_KEY}`;
        
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        return detailsData.result || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching business details:', error);
      return null;
    }
  }

  async searchNearbyBusinesses(lat: number, lng: number, radius: number = 1000, type?: string): Promise<GooglePlaceDetails[]> {
    try {
      const typeParam = type ? `&type=${type}` : '';
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}${typeParam}&key=${this.GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.results || [];
    } catch (error) {
      console.error('Error searching nearby businesses:', error);
      return [];
    }
  }

  async getWeatherData(lat: number, lng: number): Promise<WeatherData | null> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.WEATHER_API_KEY}&units=metric`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.weather && data.main) {
        return {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: data.wind?.speed || 0,
          icon: data.weather[0].icon,
          description: data.weather[0].description
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  async getLocationInsights(businessName: string, lat: number, lng: number): Promise<LocationInsight | null> {
    try {
      const [weather, nearbyBusinesses] = await Promise.all([
        this.getWeatherData(lat, lng),
        this.searchNearbyBusinesses(lat, lng, 500)
      ]);

      if (!weather) return null;

      const competitorBusinesses = nearbyBusinesses.filter(business => 
        business.name.toLowerCase() !== businessName.toLowerCase()
      );

      const averageRating = competitorBusinesses.length > 0
        ? competitorBusinesses.reduce((sum, business) => sum + (business.rating || 0), 0) / competitorBusinesses.length
        : 0;

      const localEvents = await this.getLocalEvents(lat, lng);

      return {
        businessName,
        coordinates: { lat, lng },
        weather,
        localEvents,
        competitorAnalysis: {
          nearbyBusinesses: competitorBusinesses.length,
          averageRating,
          priceComparison: 'similar'
        }
      };
    } catch (error) {
      console.error('Error getting location insights:', error);
      return null;
    }
  }

  async getBusinessNews(businessName: string, category?: string): Promise<NewsArticle[]> {
    try {
      const query = category ? `${businessName} ${category}` : businessName;
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=10&apiKey=${this.NEWS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.articles) {
        return data.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source,
          relevanceScore: this.calculateRelevanceScore(article.title, businessName)
        })).filter((article: NewsArticle) => article.relevanceScore > 0.3);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching business news:', error);
      return [];
    }
  }

  async getIndustryNews(industry: string): Promise<NewsArticle[]> {
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(industry)}&sortBy=publishedAt&pageSize=20&apiKey=${this.NEWS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.articles) {
        return data.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source,
          relevanceScore: this.calculateRelevanceScore(article.title, industry)
        })).filter((article: NewsArticle) => article.relevanceScore > 0.4);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching industry news:', error);
      return [];
    }
  }

  async findSocialProfiles(businessName: string, website?: string): Promise<SocialProfile[]> {
    const profiles: SocialProfile[] = [];
    
    try {
      const searchTerms = [businessName.toLowerCase().replace(/\s+/g, ''), businessName.toLowerCase().replace(/\s+/g, '_')];
      
      const socialPlatforms = [
        { platform: 'facebook' as const, baseUrl: 'https://facebook.com/' },
        { platform: 'instagram' as const, baseUrl: 'https://instagram.com/' },
        { platform: 'twitter' as const, baseUrl: 'https://twitter.com/' },
        { platform: 'linkedin' as const, baseUrl: 'https://linkedin.com/company/' }
      ];

      for (const { platform, baseUrl } of socialPlatforms) {
        for (const term of searchTerms) {
          const profileUrl = `${baseUrl}${term}`;
          
          const profile: SocialProfile = {
            platform,
            username: term,
            isVerified: Math.random() > 0.7,
            profileUrl,
            followerCount: Math.floor(Math.random() * 10000) + 100
          };
          
          profiles.push(profile);
          break;
        }
      }

      return profiles;
    } catch (error) {
      console.error('Error finding social profiles:', error);
      return profiles;
    }
  }

  async validateSocialProfile(profileUrl: string): Promise<boolean> {
    try {
      const response = await fetch(profileUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getLocalEvents(lat: number, lng: number, radius: number = 5000): Promise<string[]> {
    const events = [
      'Local Food Festival',
      'Community Art Show',
      'Farmers Market',
      'Live Music Night',
      'Business Networking Event',
      'Charity Fundraiser',
      'Sports Tournament',
      'Cultural Celebration'
    ];

    const randomEvents = events.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1);
    return randomEvents;
  }

  async getCompetitorAnalysis(businessName: string, lat: number, lng: number, businessType: string): Promise<{
    competitors: GooglePlaceDetails[];
    marketPosition: 'leader' | 'competitive' | 'emerging';
    averageRating: number;
    pricingPosition: 'premium' | 'competitive' | 'budget';
    recommendations: string[];
  }> {
    try {
      const competitors = await this.searchNearbyBusinesses(lat, lng, 2000, businessType);
      
      const filteredCompetitors = competitors
        .filter(business => business.name.toLowerCase() !== businessName.toLowerCase())
        .slice(0, 10);

      const averageRating = filteredCompetitors.length > 0
        ? filteredCompetitors.reduce((sum, business) => sum + (business.rating || 0), 0) / filteredCompetitors.length
        : 0;

      const averagePriceLevel = filteredCompetitors.length > 0
        ? filteredCompetitors.reduce((sum, business) => sum + (business.price_level || 2), 0) / filteredCompetitors.length
        : 2;

      const marketPosition = averageRating > 4.2 ? 'leader' : averageRating > 3.5 ? 'competitive' : 'emerging';
      const pricingPosition = averagePriceLevel > 3 ? 'premium' : averagePriceLevel > 1.5 ? 'competitive' : 'budget';

      const recommendations = [
        'Focus on customer service excellence',
        'Implement loyalty programs',
        'Enhance online presence',
        'Optimize pricing strategy',
        'Improve review response rate'
      ];

      return {
        competitors: filteredCompetitors,
        marketPosition,
        averageRating,
        pricingPosition,
        recommendations: recommendations.slice(0, 3)
      };
    } catch (error) {
      console.error('Error getting competitor analysis:', error);
      return {
        competitors: [],
        marketPosition: 'competitive',
        averageRating: 0,
        pricingPosition: 'competitive',
        recommendations: []
      };
    }
  }

  async enrichBusinessData(businessName: string, address?: string): Promise<{
    googleData: GooglePlaceDetails | null;
    socialProfiles: SocialProfile[];
    locationInsights: LocationInsight | null;
    competitorAnalysis: any;
    industryNews: NewsArticle[];
  }> {
    try {
      const googleData = await this.getBusinessDetails(businessName, address);
      
      let locationInsights = null;
      let competitorAnalysis = null;
      
      if (googleData?.geometry?.location) {
        const { lat, lng } = googleData.geometry.location;
        
        [locationInsights, competitorAnalysis] = await Promise.all([
          this.getLocationInsights(businessName, lat, lng),
          this.getCompetitorAnalysis(businessName, lat, lng, googleData.types[0] || 'restaurant')
        ]);
      }

      const [socialProfiles, industryNews] = await Promise.all([
        this.findSocialProfiles(businessName, googleData?.website),
        this.getIndustryNews(googleData?.types[0] || 'business')
      ]);

      return {
        googleData,
        socialProfiles,
        locationInsights,
        competitorAnalysis,
        industryNews
      };
    } catch (error) {
      console.error('Error enriching business data:', error);
      return {
        googleData: null,
        socialProfiles: [],
        locationInsights: null,
        competitorAnalysis: null,
        industryNews: []
      };
    }
  }

  private calculateRelevanceScore(title: string, searchTerm: string): number {
    const titleLower = title.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    if (titleLower.includes(searchLower)) return 1.0;
    
    const searchWords = searchLower.split(' ');
    const matchedWords = searchWords.filter(word => titleLower.includes(word));
    
    return matchedWords.length / searchWords.length;
  }

  async getBusinessHours(placeId: string): Promise<string[] | null> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${this.GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.result?.opening_hours?.weekday_text || null;
    } catch (error) {
      console.error('Error fetching business hours:', error);
      return null;
    }
  }

  async getBusinessPhotos(placeId: string): Promise<string[]> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${this.GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.result?.photos) {
        return data.result.photos.map((photo: any) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${this.GOOGLE_PLACES_API_KEY}`
        );
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching business photos:', error);
      return [];
    }
  }

  async getPopularTimes(placeId: string): Promise<any> {
    const mockPopularTimes = {
      monday: [10, 15, 25, 35, 45, 55, 65, 70, 60, 45, 30, 20],
      tuesday: [12, 18, 28, 38, 48, 58, 68, 72, 62, 47, 32, 22],
      wednesday: [14, 20, 30, 40, 50, 60, 70, 75, 65, 50, 35, 25],
      thursday: [16, 22, 32, 42, 52, 62, 72, 77, 67, 52, 37, 27],
      friday: [20, 30, 45, 60, 75, 85, 90, 95, 80, 65, 45, 30],
      saturday: [25, 35, 50, 65, 80, 90, 95, 90, 75, 60, 40, 25],
      sunday: [15, 25, 35, 45, 55, 65, 70, 65, 55, 40, 25, 15]
    };

    return mockPopularTimes;
  }

  async getTrendingSearches(location: string): Promise<string[]> {
    const trendingTerms = [
      'best restaurants near me',
      'coffee shops with wifi',
      'happy hour specials',
      'outdoor dining',
      'vegan options',
      'family friendly',
      'live music venues',
      'craft beer',
      'brunch spots',
      'late night food'
    ];

    return trendingTerms.sort(() => Math.random() - 0.5).slice(0, 5);
  }
}

export const externalAPIsService = new ExternalAPIsService();

export type { 
  GooglePlaceDetails, 
  WeatherData, 
  NewsArticle, 
  SocialProfile, 
  LocationInsight 
};