'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconCookie } from '@tabler/icons-react';
import { Button, Dialog, DialogContent, DialogDescription } from '@dealo/ui';

const storeKey = 'dealo_cookies_banner_accepted';

export default function CookiesBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (window) {
      const hasCookieBanner = localStorage.getItem(storeKey);
      if (!hasCookieBanner) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(storeKey, 'true');
    setShowBanner(false);
  }

  if (!showBanner) {
    return null;
  }

  return (
    <Dialog open modal={false}>
      <DialogContent hideClose centered={false} className="w-[380px] left-auto top-auto right-4 bottom-4">
        <DialogDescription className="flex flex-col gap-4">
          <IconCookie size={80} className="text-emerald-600" />
          <h3 className="text-2xl font-bold">We use cookies</h3>
          <p className="text-base text-black">
            We use cookies to provide you with the best possible experience.
            <br/>
            These are not third-party cookies and are used only for the functionality of the site.
            <br/>
            By using our site, you agree to our use of cookies.
          </p>
          <div className="flex flex-row">
            <Link href="/privacy-policy">
              <Button variant="ghost">Privacy Policy</Button>
            </Link>
            <Button variant="outline" className="ml-auto" onClick={handleAccept}>Accept</Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
