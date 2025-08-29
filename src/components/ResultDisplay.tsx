import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, CheckCircle, XCircle, Shield, Image as ImageIcon } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    success: boolean;
    imageUrl?: string;
    message: string;
    operation: 'encrypt' | 'decrypt';
  } | null;
  onDownload?: () => void;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  onDownload,
  onReset,
}) => {
  if (!result) return null;

  const handleDownload = () => {
    if (result.imageUrl && onDownload) {
      // Create download link
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `${result.operation}ed-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onDownload();
    }
  };

  return (
    <Card className="p-6 bg-gradient-secondary border-border/50">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${result.success ? 'bg-success/10' : 'bg-destructive/10'}`}>
            <Shield className={`h-5 w-5 ${result.success ? 'text-success' : 'text-destructive'}`} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {result.operation === 'encrypt' ? 'Encryption' : 'Decryption'} Result
          </h3>
        </div>

        <Alert className={`${result.success ? 'border-success/50 bg-success/10' : 'border-destructive/50 bg-destructive/10'}`}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-success" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
          <AlertDescription className={result.success ? 'text-success-foreground' : 'text-destructive-foreground'}>
            {result.message}
          </AlertDescription>
        </Alert>

        {result.success && result.imageUrl && (
          <div className="space-y-4">
            <div className="relative group rounded-lg overflow-hidden border border-border/50">
              <img
                src={result.imageUrl}
                alt={`${result.operation}ed image`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  variant="default"
                  onClick={handleDownload}
                  className="bg-background/90 text-foreground hover:bg-background"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <ImageIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {result.operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} Image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ready for download
                  </p>
                </div>
              </div>
              <Button
                variant="secure"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onReset}
            className="flex-1"
          >
            Process Another Image
          </Button>
          {result.success && result.imageUrl && (
            <Button
              variant="gradient"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4" />
              Download Result
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};