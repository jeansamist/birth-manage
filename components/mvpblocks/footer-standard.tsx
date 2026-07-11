'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ArrowDownLeft,
  MessageCircle,
  GlobeIcon,
  ShieldCheckIcon
} from 'lucide-react';

const Twitter = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Github = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const Linkedin = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!mounted) return null;

  return (
    <footer className="mt-20 w-full border-t border-border bg-background relative overflow-hidden">
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
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black uppercase tracking-wider text-foreground leading-tight">BUNEC</span>
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Bureau National de l&apos;État Civil</span>
              </div>
            </Link>
            
            <div className="space-y-2 text-sm text-muted-foreground max-w-sm leading-relaxed text-left">
              <p>
                <strong>Système National d'Enregistrement de l'État Civil (SENEC)</strong>. Plateforme souveraine de l'État du Cameroun pour la numérisation, l'impression sécurisée et la vérification instantanée des actes de naissance.
              </p>
              <div className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-wider">
                <ShieldCheckIcon className="size-3.5" />
                <span>Certification Cryptographique Zero-Trust</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 border border-border bg-muted/50 px-2.5 py-1 rounded-md">
                <div className="relative w-4 h-3">
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-[#007A5E]" />
                    <div className="flex-1 bg-[#CE1126] flex items-center justify-center text-[2px] text-white">★</div>
                    <div className="flex-1 bg-[#FCD116]" />
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">État Civil Camerounais</span>
              </div>
            </div>

            <h1 className="from-border bg-gradient-to-b bg-clip-text text-5xl font-extrabold text-transparent lg:text-6xl uppercase tracking-widest text-left select-none opacity-20">
              BUNEC
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="grid w-full grid-cols-2 items-start justify-between gap-8 px-5 lg:col-span-3">
            {(['services', 'gouvernement', 'securite', 'legal'] as const).map(
              (section) => (
                <div key={section} className="w-full text-left">
                  <h3 className="border-primary mb-4 -ml-5 border-l-2 pl-5 text-[11px] font-bold tracking-wider uppercase text-foreground">
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
                          className="group text-muted-foreground hover:text-foreground text-sm decoration-primary -ml-5 inline-flex items-center gap-1.5 underline-offset-4 transition-all duration-300 hover:pl-5 hover:underline"
                        >
                          <ArrowDownLeft className="text-primary size-3 rotate-[225deg] opacity-40 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
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
        <div className="h-px w-full bg-border" />
        <div className="text-muted-foreground container m-auto flex flex-col items-center justify-between gap-4 p-6 text-[11px] md:flex-row md:px-0 font-medium">
          <p className="uppercase tracking-wider">
            &copy; {currentYear} Bureau National de l'État Civil (BUNEC) · République du Cameroun | Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {data().bottomLinks.map(({ href, label }) => (
              <Link key={label} href={href} className="hover:text-foreground transition-colors uppercase tracking-wider text-[10px] font-bold">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
