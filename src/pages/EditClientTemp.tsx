import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => navigate('/clients')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground">Edit Client</h1>
        <p className="text-muted-foreground mt-2">
          Editing client: {id}
        </p>
        
        <div className="mt-8 p-6 border rounded">
          <p>Edit form will be implemented here...</p>
        </div>
      </div>
    </div>
  );
};

export default EditClient;
