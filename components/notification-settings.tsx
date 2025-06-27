export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    rewardNotifications: true,
    reviewNotifications: true,
    achievementNotifications: true,
    governanceNotifications: true,
    systemNotifications: false,
    businessResponseNotifications: true,
    weeklyDigest: true
  })

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Customize how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Delivery Methods</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email notifications</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                className={settings.emailNotifications ? 'bg-green-600' : ''}
              >
                {settings.emailNotifications ? 'On' : 'Off'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Push notifications</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSetting('pushNotifications', !settings.pushNotifications)}
                className={settings.pushNotifications ? 'bg-green-600' : ''}
              >
                {settings.pushNotifications ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Notification Types</h4>
          <div className="space-y-3">
            {[
              { key: 'rewardNotifications', label: 'ALGO rewards earned', icon: Coins },
              { key: 'reviewNotifications', label: 'Review responses and votes', icon: Star },
              { key: 'achievementNotifications', label: 'New achievements unlocked', icon: Award },
              { key: 'governanceNotifications', label: 'Governance proposals and voting', icon: Shield },
              { key: 'businessResponseNotifications', label: 'Business responses to reviews', icon: MessageSquare },
              { key: 'systemNotifications', label: 'Platform updates and maintenance', icon: Bell }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{label}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting(key as keyof typeof settings, !settings[key as keyof typeof settings])}
                  className={settings[key as keyof typeof settings] ? 'bg-green-600' : ''}
                >
                  {settings[key as keyof typeof settings] ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Digest Options</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm">Weekly activity digest</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSetting('weeklyDigest', !settings.weeklyDigest)}
              className={settings.weeklyDigest ? 'bg-green-600' : ''}
            >
              {settings.weeklyDigest ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  )
}