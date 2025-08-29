import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, CheckCircle, XCircle, Shield, Image as ImageIcon } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    success: boolean;
    compressedImageUrl?: string;
    encryptedImageUrl?: string;
    message: string;
    operation: 'encrypt' | 'decrypt';
  } | null;
  onDownload?: (type: 'compressed' | 'encrypted') => void;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  onDownload,
  onReset,
}) => {
  if (!result) return null;

  const handleDownload = (imageUrl: string, type: 'compressed' | 'encrypted') => {
    if (imageUrl && onDownload) {
      // Create download link
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${type}-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onDownload(type);
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

        {result.success && (result.compressedImageUrl || result.encryptedImageUrl) && (
          <div className="space-y-6">
            {/* Compressed Image Section */}
            {result.compressedImageUrl && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <h4 className="text-sm font-semibold text-foreground">Compressed Image</h4>
                </div>
                
                <div className="relative group rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={result.compressedImageUrl}
                    alt="Compressed image"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="default"
                      onClick={() => handleDownload(result.compressedImageUrl!, 'compressed')}
                      className="bg-background/90 text-foreground hover:bg-background"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Compressed Image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Optimized for storage
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(result.compressedImageUrl!, 'compressed')}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Encrypted Image Section */}
            {result.encryptedImageUrl && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {result.operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} Image
                  </h4>
                </div>
                
                <div className="relative group rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={result.encryptedImageUrl}
                    alt={`${result.operation}ed image`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="default"
                      onClick={() => handleDownload(result.encryptedImageUrl!, 'encrypted')}
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
                    onClick={() => handleDownload(result.encryptedImageUrl!, 'encrypted')}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
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
          {result.success && (result.compressedImageUrl || result.encryptedImageUrl) && (
            <div className="flex gap-3 flex-1">
              {result.compressedImageUrl && (
                <Button
                  variant="gradient"
                  onClick={() => handleDownload(result.compressedImageUrl!, 'compressed')}
                  className="flex-1"
                >
                  <Download className="h-4 w-4" />
                  Download Compressed
                </Button>
              )}
              {result.encryptedImageUrl && (
                <Button
                  variant="gradient"
                  onClick={() => handleDownload(result.encryptedImageUrl!, 'encrypted')}
                  className="flex-1"
                >
                  <Download className="h-4 w-4" />
                  Download {result.operation === 'encrypt' ? 'Encrypted' : 'Decrypted'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};