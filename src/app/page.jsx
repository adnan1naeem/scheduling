// project import
import GuestGuard from 'utils/route-guard/GuestGuard';
// import Login from 'views/auth/';
import SamplePage from 'views/sample-page';

export default function HomePage() {
  return (
    <GuestGuard>
      <SamplePage />
    </GuestGuard>
  );
}
