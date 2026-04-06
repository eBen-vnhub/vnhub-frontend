import logoUrl from '../../assets/images/eBen-logo.png';

export default function EbenLogo() {
  return (
    <img
      src={logoUrl}
      alt="eBen Logo"
      className="w-full h-full object-contain"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          'https://res.cloudinary.com/dmp2hfqmp/image/upload/v1768378337/eBen_Logo_YP_Border_Blue_and_Green_1_hhkqig.png';
      }}
    />
  );
}
