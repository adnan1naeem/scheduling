import SamplePage from 'views/sample-page';
import Image from 'next/legacy/image';
import logoImage from '/public/assets/images/contact/image.png';

// ==============================|| PAGE ||============================== //

export default function SampleViewPage() {
  return <div style={{marginTop: -50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* <Image src={logoImage} width={240} height={120} /> */}
    <SamplePage />
  </div>;
}
