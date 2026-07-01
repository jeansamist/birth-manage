'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  Github,
  Linkedin,
  Twitter,
  Moon,
  Sun,
  ArrowDownLeft,
  MessageCircle,
  GlobeIcon,
  ShieldCheckIcon
} from 'lucide-react';

const data = () => ({
  navigation: {
    services: [
      { name: "Recherche d'Acte", href: '/citizen' },
      { name: 'Suivre un dossier', href: '/citizen/track' },
      { name: 'Déclaration FNU', href: '/citizen/submit' },
      { name: 'Vérification Publique', href: '/verify/TRK' },
    ],
    gouvernement: [
      { name: 'Présidence du Cameroun', href: 'https://www.prc.cm' },
      { name: 'Services du Premier Ministre', href: 'https://www.spm.gov.cm' },
      { name: 'Ministère Administration (MINAT)', href: 'https://minat.gov.cm' },
      { name: 'Ministère Santé (MINSANTE)', href: 'https://minsante.cm' },
    ],
    securite: [
      { name: 'Sûreté Nationale (DGSN)', href: 'https://www.dgsn.cm' },
      { name: 'BUNEC National', href: 'https://bunec.cm' },
      { name: 'Loi n° 2011/011 État Civil', href: '#' },
      { name: 'Portail des Impôts', href: '#' },
    ],
    legal: [
      { name: 'Mentions Légales', href: '#' },
      { name: 'Données Personnelles', href: '#' },
      { name: 'Conditions d\'Utilisation', href: '#' },
      { name: 'Assistance Technique', href: '#' },
    ],
  },
  bottomLinks: [
    { href: '#', label: 'Politique de Confidentialité' },
    { href: '#', label: 'Conditions Générales' },
    { href: '#', label: 'Support BUNEC' },
  ],
});

export default function FooterStandard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!mounted) return null;

  return (
    <footer className="mt-20 w-full border-t border-neutral-200 bg-white relative overflow-hidden">
      {/* Cameroon Tricolor separator line */}
      <div className="w-full h-1 flex select-none">
        <div className="flex-1 bg-[#007A5E]" />
        <div className="flex-1 bg-[#CE1126] relative">
          <div className="absolute inset-0 flex items-center justify-center text-[5px] text-[#FCD116] font-bold">★</div>
        </div>
        <div className="flex-1 bg-[#FCD116]" />
      </div>

      <div className="relative w-full px-5">
        {/* Top Section */}
        <div className="container m-auto grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Institution Info */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/citizen" className="inline-flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/bunec-logo.png"
                  alt="BUNEC Logo"
                  fill
                  className="object-contain animate-pulse"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black uppercase tracking-wider text-neutral-800 leading-tight">BUNEC</span>
                <span className="text-[7.5px] font-black text-neutral-500 uppercase tracking-widest leading-none">Bureau National de l'État Civil</span>
              </div>
            </Link>
            
            <div className="space-y-2 text-xs text-neutral-500 max-w-sm leading-relaxed text-left">
              <p>
                <strong>Système National d'Enregistrement de l'État Civil (SENEC)</strong>. Plateforme souveraine de l'État du Cameroun pour la numérisation, l'impression sécurisée et la vérification instantanée des actes de naissance.
              </p>
              <div className="flex items-center gap-1 text-[#007A5E] font-bold text-[9px] uppercase tracking-wider">
                <ShieldCheckIcon className="size-3.5" />
                <span>Certification Cryptographique Zero-Trust</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-[#007A5E] dark:hover:bg-[#007A5E] !border-neutral-200 cursor-pointer shadow-none transition-all duration-300 hover:scale-105 hover:text-white"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              <div className="flex items-center gap-1.5 ml-2 border border-neutral-100 bg-neutral-50/50 px-2.5 py-1 rounded-sm">
                <div className="relative w-4 h-3">
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-[#007A5E]" />
                    <div className="flex-1 bg-[#CE1126] flex items-center justify-center text-[2px] text-white">★</div>
                    <div className="flex-1 bg-[#FCD116]" />
                  </div>
                </div>
                <span className="text-[8px] font-black uppercase text-neutral-600 tracking-wider">État Civil Camerounais</span>
              </div>
            </div>

            <h1 className="from-neutral-200 bg-gradient-to-b bg-clip-text text-5xl font-extrabold text-transparent lg:text-6xl uppercase tracking-widest text-left select-none opacity-40">
              BUNEC
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="grid w-full grid-cols-2 items-start justify-between gap-8 px-5 lg:col-span-3">
            {(['services', 'gouvernement', 'securite', 'legal'] as const).map(
              (section) => (
                <div key={section} className="w-full text-left">
                  <h3 className="border-[#007A5E] mb-4 -ml-5 border-l-2 pl-5 text-[10px] font-black tracking-wider uppercase text-neutral-800">
                    {section === 'services' && 'Services Citoyens'}
                    {section === 'gouvernement' && 'Portails Étatiques'}
                    {section === 'securite' && 'Lois & Sécurité'}
                    {section === 'legal' && 'Assistance & Légal'}
                  </h3>
                  <ul className="space-y-3">
                    {data().navigation[section].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="group text-neutral-500 hover:text-neutral-900 text-xs decoration-[#007A5E] -ml-5 inline-flex items-center gap-1.5 underline-offset-4 transition-all duration-300 hover:pl-5 hover:underline"
                        >
                          <ArrowDownLeft className="text-[#007A5E] size-3 rotate-[225deg] opacity-40 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="h-px w-full bg-neutral-100" />
        <div className="text-neutral-400 container m-auto flex flex-col items-center justify-between gap-4 p-6 text-[10px] md:flex-row md:px-0 font-medium">
          <p className="uppercase tracking-wider">
            &copy; {currentYear} Bureau National de l'État Civil (BUNEC) · République du Cameroun | Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {data().bottomLinks.map(({ href, label }) => (
              <Link key={label} href={href} className="hover:text-neutral-800 transition-colors uppercase tracking-wider text-[9px] font-bold">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
