import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Unlock, Info } from 'lucide-react';
import { useGetAppConfig, useUpdateAppConfig } from '../hooks/useQueries';
import { useAdminSession } from '../lib/adminSession';
import { toast } from 'sonner';

export default function AdminPage() {
  const { data: appConfig, isLoading } = useGetAppConfig();
  const updateConfig = useUpdateAppConfig();
  const { isAdminSession, activateAdminSession, clearAdminSession } = useAdminSession();

  const [passcodeInput, setPasscodeInput] = useState('');
  const [newPasscode, setNewPasscode] = useState('');

  const handleLogin = () => {
    if (!appConfig) {
      toast.error('Configuration is loading, please wait');
      return;
    }
    if (passcodeInput === appConfig.adminPasscode) {
      activateAdminSession();
      setPasscodeInput('');
      toast.success('Admin session activated');
    } else {
      toast.error('Invalid passcode');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    toast.success('Admin session ended');
  };

  const handleToggleReleased = async () => {
    if (!appConfig || !isAdminSession) return;
    await updateConfig.mutateAsync({
      ...appConfig,
      isReleased: !appConfig.isReleased,
    });
  };

  const handleChangePasscode = async () => {
    if (!appConfig || !isAdminSession || !newPasscode) return;
    await updateConfig.mutateAsync({
      ...appConfig,
      adminPasscode: newPasscode,
    });
    setNewPasscode('');
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin & Settings</h2>
        {isAdminSession && (
          <Badge variant="default" className="gap-2">
            <Shield className="h-3 w-3" />
            Admin Session Active
          </Badge>
        )}
      </div>

      {/* Auto-Admin Mode Info */}
      {isAdminSession && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-primary">Auto-Admin Mode Active</p>
                <p className="text-sm text-muted-foreground">
                  The app starts with admin privileges by default. You can validate with the passcode to confirm admin access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Session</CardTitle>
          <CardDescription>
            Enter the admin passcode to activate admin privileges for this browser session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAdminSession ? (
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="password"
                  placeholder="Enter admin passcode"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <Button onClick={handleLogin} disabled={!passcodeInput}>
                <Lock className="h-4 w-4 mr-2" />
                Activate Session
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Admin session is active</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <Unlock className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Status */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Current mode and version information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Current Mode</p>
              <p className="text-sm text-muted-foreground">
                {appConfig?.isReleased ? 'Released (Public editing enabled)' : 'Pre-release (Admin-only editing)'}
              </p>
            </div>
            <Badge variant={appConfig?.isReleased ? 'default' : 'secondary'} className="text-base px-4 py-1">
              {appConfig?.isReleased ? 'Released' : 'Pre-release'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Version</p>
              <p className="text-sm text-muted-foreground">Application version number</p>
            </div>
            <Badge variant="outline">{appConfig?.version || '0.1'}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Admin Controls */}
      {isAdminSession && appConfig && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Release Mode</CardTitle>
              <CardDescription>
                Control whether the application is in pre-release or released mode.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="release-mode" className="text-base font-medium">
                    Enable Public Editing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, all users can create and edit use cases and releases. Delete operations remain admin-only.
                  </p>
                </div>
                <Switch
                  id="release-mode"
                  checked={appConfig.isReleased}
                  onCheckedChange={handleToggleReleased}
                  disabled={updateConfig.isPending}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Admin Passcode</CardTitle>
              <CardDescription>Update the passcode required for admin access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="password"
                    placeholder="Enter new passcode"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleChangePasscode}
                  disabled={!newPasscode || updateConfig.isPending}
                >
                  Update Passcode
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
