
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      const success = await forgotPassword(email);
      if (success) {
        setSuccess(true);
      } else {
        setError('Email not found');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>
                If the email exists in our system, you will receive a password reset link.
                <br />
                <span className="font-semibold mt-2 block">
                  (Note: This is a demo, so no actual email is sent. Use admin@example.com to test)
                </span>
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Link to="/admin/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
