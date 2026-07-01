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
      question: "Qu'est-ce que l'Identifiant Unique Citoyen (CID) ?",
      answer:
        "L'Identifiant Unique Citoyen (CID) est un code sécurisé généré dès la naissance d'un enfant par l'établissement médical. Il permet aux parents de suivre le traitement de leur dossier en ligne et, une fois l'acte signé par l'officier d'état civil, d'accéder au téléchargement officiel du document de manière hautement contrôlée.",
    },
    {
      question: "Comment suivre l'avancement de ma déclaration de naissance ?",
      answer:
        "Vous pouvez utiliser l'onglet 'Suivre un dossier' en saisissant votre identifiant de suivi (TRK) ou votre CID. Une timeline interactive bilingue affiche en temps réel les étapes validées par le médecin, le secrétaire d'état civil et enfin la signature par le Maire.",
    },
    {
      question: "Comment transférer une copie de mon acte vers une autre mairie ?",
      answer:
        "Une fois votre acte officiel approuvé et enregistré dans votre mairie d'origine, vous pouvez introduire une demande de transfert en ligne vers n'importe quelle autre mairie connectée du réseau national. Après approbation par l'officier d'état civil destinataire, une copie physique certifiée y sera immédiatement disponible.",
    },
    {
      question: "La vérification d'acte par QR Code est-elle publique et sécurisée ?",
      answer:
        "Oui. Toute administration ou autorité peut scanner le QR code d'un acte officiel imprimé pour être redirigée vers une page de vérification publique sécurisée. Cette page garantit l'authenticité de l'acte en comparant la signature cryptographique du document physique avec celle stockée dans notre registre central.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-12 border-t border-neutral-200 bg-neutral-50/10">
      <div className="relative mx-auto max-w-4xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge
            variant="outline"
            className="border-neutral-300 text-neutral-500 rounded-sm mb-3 px-3 py-0.5 text-[9px] font-bold tracking-widest uppercase"
          >
            Foire Aux Questions / FAQ
          </Badge>

          <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider mb-2">
            Questions Fréquentes
          </h2>
          <p className="text-neutral-500 text-xs">
            Tout ce qu'il faut savoir sur la gestion numérique de l'état civil.
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
