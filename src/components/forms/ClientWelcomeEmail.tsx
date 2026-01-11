import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClientWelcomeEmailProps {
  clientId: string;
  clientName: string;
  contactEmail?: string;
  onEmailSent?: () => void;
}

const ClientWelcomeEmail = ({ 
  clientId, 
  clientName, 
  contactEmail,
  onEmailSent 
}: ClientWelcomeEmailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  const defaultWelcomeMessage = `
Dear ${clientName} Team,

Welcome to Insurio! We're excited to have you as our client and look forward to providing you with comprehensive insurance solutions.

Your account has been successfully created and is now active. Here's what happens next:

1. **Account Setup**: Your dedicated account manager will reach out within 24 hours to understand your specific insurance needs.
2. **Policy Assessment**: We'll work with you to assess your current coverage and identify opportunities for optimization.
3. **Implementation**: Once policies are selected, we'll handle all the paperwork and setup.

Next Steps:
- Complete your company profile in our client portal
- Schedule your initial consultation with your account manager
- Review and approve recommended insurance policies

If you have any questions, please don't hesitate to reach out to our client support team.

Best regards,
The Insurio Team
  `.trim();

  const handleSendWelcomeEmail = async () => {
    if (!sendEmail || !contactEmail) {
      onEmailSent?.();
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would integrate with your email service
      // For now, we'll simulate the email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      onEmailSent?.();
      
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-green-900">Welcome Email Sent!</h3>
              <p className="text-green-700">
                The welcome email has been successfully sent to {contactEmail}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Welcome Email
        </CardTitle>
        <CardDescription>
          Send a welcome email to your new client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="send-email"
            checked={sendEmail}
            onCheckedChange={setSendEmail}
          />
          <Label htmlFor="send-email">Send welcome email to client</Label>
        </div>

        {sendEmail && (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                type="email"
                value={contactEmail || ''}
                placeholder="client@company.com"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-message">Custom Message (Optional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Add a personal touch to the welcome message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={6}
              />
              <p className="text-sm text-gray-500">
                Leave blank to use the default welcome message
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Preview:</h4>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {customMessage || defaultWelcomeMessage}
              </div>
            </div>
          </>
        )}

        <Button 
          onClick={handleSendWelcomeEmail}
          disabled={isLoading || (sendEmail && !contactEmail)}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {sendEmail ? 'Send Welcome Email' : 'Complete Onboarding'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientWelcomeEmail;
