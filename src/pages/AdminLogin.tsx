
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(password)) {
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      navigate('/admin');
    } else {
      toast({
        title: "Access Denied",
        description: "The password you entered is incorrect.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="space-y-1 flex flex-col items-center pb-6">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-center">Admin Access</h2>
            <p className="text-sm text-muted-foreground text-center">
              Enter password to access the admin dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;
