"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      className={cn(
        "group border-neutral-200 rounded-md border bg-white",
        "transition-all duration-200 ease-in-out",
        isOpen ? "shadow-xs border-neutral-300" : "hover:border-neutral-300"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 cursor-pointer"
      >
        <h3
          className={cn(
            "text-left text-xs font-bold uppercase tracking-wider transition-colors duration-200",
            "text-neutral-700",
            isOpen && "text-neutral-900"
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.05 : 1,
          }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          className={cn(
            "shrink-0 rounded-full p-0.5 transition-colors duration-200 text-neutral-400",
            isOpen && "text-neutral-900"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.05,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.25,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.15,
                },
              },
            }}
          >
            <div className="border-t border-neutral-100 px-6 pt-3 pb-5">
              <motion.p
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="text-neutral-500 text-xs leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const faqs: Omit<FAQItemProps, "index">[] = [
    {
      question: "Quel est le délai légal au Cameroun pour déclarer une naissance ?",
      answer:
        "Conformément à la loi camerounaise relative à l'état civil, vous disposez d'un délai légal de quatre-vingt-dix (90) jours pour déclarer une naissance auprès de la Mairie (ou du centre d'état civil secondaire) du lieu d'accouchement. Passé ce délai de 90 jours, l'acte de naissance ne pourra plus être établi directement et nécessitera l'obtention d'un jugement supplétif auprès du tribunal de grande instance compétent.",
    },
    {
      question: "Comment fonctionne l'Identifiant Unique Citoyen (CID) attribué par le BUNEC ?",
      answer:
        "Le CID (Citizen ID) est un identifiant unique à 16 caractères généré par le registre national du Bureau National de l'État Civil (BUNEC) lors de la saisie hospitalière. Ce code sécurisé permet de lier de manière définitive l'enfant à sa filiation et sert de clé d'accès unique pour imprimer l'acte de naissance officiel ou demander une copie certifiée conforme en ligne.",
    },
    {
      question: "Puis-je retirer une copie certifiée d'acte dans n'importe quelle Mairie (ex: Douala vers Yaoundé) ?",
      answer:
        "Oui, c'est l'un des avantages majeurs du système interconnecté initié par le MINAT et le BUNEC. Si l'acte de naissance d'origine a été établi à la Mairie de Garoua ou de Douala Ier, et que vous résidez actuellement à Yaoundé, vous pouvez introduire une demande de transfert en ligne. Dès que l'Officier d'état civil de votre mairie de résidence (ex: Yaoundé VI) valide le transfert, la copie y est imprimable instantanément sans voyage physique.",
    },
    {
      question: "La vérification d'acte par QR Code est-elle acceptée par les administrations publiques et ambassades ?",
      answer:
        "Absolument. Les administrations camerounaises (DGSN pour l'obtention de la CNI ou du Passeport, Ministères) et les représentations diplomatiques à l'étranger scannent le QR Code présent sur l'acte officiel imprimé au format A4. Ce scan les redirige instantanément vers le portail public de vérification sécurisé du BUNEC, confirmant l'authenticité de l'acte et réduisant à zéro les risques de faux actes physiques.",
    },
    {
      question: "Que faire en cas d'accouchement hors-système ou à domicile en zone rurale ?",
      answer:
        "Si l'accouchement a eu lieu à domicile ou dans une clinique non raccordée au réseau numérique, le parent doit utiliser l'onglet 'Déclaration FNU' sur ce portail. Il lui suffit de remplir les informations d'identité, de sélectionner sa mairie locale, et de téléverser la photo ou le scan de la déclaration papier établie par l'autorité locale ou le chef de village pour instruction.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-12 border-t border-neutral-200 bg-neutral-50/10">
      <div className="relative mx-auto max-w-4xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge
            variant="outline"
            className="border-[#CE1126]/30 text-[#CE1126] bg-[#CE1126]/5 rounded-sm mb-3 px-3 py-0.5 text-[9px] font-black tracking-widest uppercase"
          >
            Foire Aux Questions / FAQ BUNEC
          </Badge>

          <h2 className="text-lg font-black text-neutral-800 uppercase tracking-wider mb-2">
            Questions Fréquentes & Législation Camerounaise
          </h2>
          <p className="text-neutral-500 text-xs">
            Comprendre la gestion numérique de l'état civil au Cameroun, la délivrance des actes et la législation en vigueur.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
