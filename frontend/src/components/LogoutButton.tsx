import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authUtils } from '@/lib/auth';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authUtils.removeUser();
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      variant='outline'
    >
      Sair
    </Button>
  );
}
