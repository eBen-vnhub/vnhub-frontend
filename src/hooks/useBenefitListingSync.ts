import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVendors } from '../contexts/VendorsContext';
import { useLanguage } from '../i18n/LanguageContext';
import vendorsService from '../services/vendors';

interface UseBenefitListingSyncProps {
  onSuccess: () => void;
  benefitId?: number;
}

export function useBenefitListingSync({ onSuccess, benefitId }: UseBenefitListingSyncProps) {
  const { user } = useAuth();
  const { vendor } = useVendors();
  const { language } = useLanguage();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const iframeReadyRef = useRef(false);
  const dataSentRef = useRef(false);

  const sendSyncData = useCallback(async () => {
    if (!iframeRef.current?.contentWindow || !vendor || !user || !iframeReadyRef.current) return;
    if (dataSentRef.current) return;

    dataSentRef.current = true;
    
    let prefillData = null;
    try {
      const data = await vendorsService.getListingsData();
      if (data.benefitListing?.benefitOffers?.length > 0) {
        const offers = data.benefitListing.benefitOffers;
        const lastBenefit = offers[offers.length - 1];
        
        prefillData = {
          hqAddress: data.benefitListing.companyAddress,
          advertisingFor: data.benefitListing.advertisingFor,
          listingGoal: data.benefitListing.listingGoal,
          socialMedia: data.benefitListing.socialMedia,
          targeting: lastBenefit.targeting,
          brandDescription: lastBenefit.brandIntro,
          brandDifferentiator: lastBenefit.brandDifferentiator,
          claimMethod: lastBenefit.claimSettings?.claimMethod,
          purchaseMethods: lastBenefit.claimSettings?.purchaseMethods,
          receiveMethods: lastBenefit.claimSettings?.receiveMethods,
          paymentCollection: lastBenefit.claimSettings?.paymentCollection,
          discountCodeType: lastBenefit.claimSettings?.discountCodeType,
          singleDiscountCode: lastBenefit.claimSettings?.singleDiscountCode,
          emailType: lastBenefit.claimSettings?.emailType,
          claimingInstructions: lastBenefit.claimSettings?.claimingInstructions,
          additionalNotes: lastBenefit.claimSettings?.additionalNotes,
        };
      }
    } catch (e) {
      console.error('Failed to fetch prefill data', e);
    }

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SYNC_BENEFIT_DATA',
        vnhubVendorId: vendor.id,
        benefitId: benefitId,
        personal: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          companyName: vendor.companyName || '',
          phoneNumber: user.mobileNumber || '',
        },
        language,
        prefillData,
      }, '*');
    }
  }, [vendor, user, language, benefitId]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SYNC_LANGUAGE',
        language,
      }, '*');
    }
  }, [language]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'BENEFIT_LISTING_SUCCESS') {
        onSuccess();
      } else if (event.data?.type === 'BENEFIT_LISTING_READY') {
        iframeReadyRef.current = true;
        setIsLoading(false);
        sendSyncData();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      iframeReadyRef.current = false;
      dataSentRef.current = false;
    };
  }, [onSuccess, sendSyncData]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    iframeRef,
    isLoading,
    handleIframeLoad,
  };
}
