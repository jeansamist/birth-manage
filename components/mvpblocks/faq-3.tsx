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
      question: "Quel est le délai légal pour déclarer une naissance au Cameroun ?",
      answer:
        "Conformément à l'article 30 de l'Ordonnance n° 81-02 du 29 juin 1981 portant organisation de l'état civil au Cameroun, modifiée par la Loi n° 2011/011 du 06 mai 2011, le délai légal de déclaration est de quatre-vingt-dix (90) jours. Au-delà de ce délai de 90 jours, le centre d'état civil ne peut plus enregistrer la naissance. Vous devrez obligatoirement obtenir un jugement supplétif d'acte de naissance auprès du Tribunal de Premier Degré (TPD) ou du Tribunal de Grande Instance (TGI) de votre ressort, ce qui rallonge et complexifie la procédure.",
    },
    {
      question: "Combien coûte l'établissement d'un acte de naissance sur ce portail ?",
      answer:
        "L'établissement de l'acte de naissance original ainsi que sa première copie certifiée dans le délai légal de 90 jours sont strictement gratuits sur l'ensemble du territoire camerounais. Aucun frais d'enregistrement, timbre municipal ou timbre fiscal (les 1000 FCFA habituels) ne doit vous être réclamé par la Mairie ou l'Hôpital pour cette formalité initiale. Ce portail numérique applique et protège cette gratuité légale voulue par l'État pour lutter contre le phénomène des 'enfants sans identité' (enfants fantômes).",
    },
    {
      question: "Le CID (Citizen ID) remplace-t-il le carnet de vaccination de la maternité ?",
      answer:
        "Non. Le CID généré par le Bureau National de l'État Civil (BUNEC) est un identifiant d'état civil numérique sécurisé. Il ne se substitue pas au carnet de vaccination ou à la déclaration de naissance papier remis par la maternité (Centre de Santé Intégré, Hôpital de District ou Hôpital Général). C'est un code de liaison numérique qui verrouille définitivement le volet médical de l'accouchement saisi par le médecin, empêchant toute falsification ultérieure des données (date, heure, sexe, identité de la mère).",
    },
    {
      question: "Puis-je imprimer une copie certifiée de mon acte dans une mairie différente de mon lieu de naissance (ex: né à Kribi, résidant à Garoua) ?",
      answer:
        "Oui. L'interconnexion nationale des centres d'état civil du BUNEC permet le transfert numérique de dossier. Si l'enfant est né à Kribi ou à Maroua, et que vous résidez actuellement à Douala Vème ou Yaoundé VI, vous pouvez soumettre une demande de transfert en ligne via l'onglet 'Suivi'. Une fois la demande validée par l'Officier d'état civil de la mairie de destination, vous pourrez imprimer une copie certifiée conforme directement dans votre mairie de résidence, évitant ainsi des déplacements coûteux.",
    },
    {
      question: "Comment les administrations (DGSN pour la CNI, MINFOPRA pour les concours) contrôlent-elles l'authenticité de mon acte ?",
      answer:
        "Chaque acte officiel imprimé via notre réseau national comporte un QR Code sécurisé lié à une signature cryptographique. Les agents de la Délégation Générale à la Sûreté Nationale (DGSN) lors de l'établissement d'une Carte Nationale d'Identité (CNI) ou d'un Passeport, de même que le Ministère de la Fonction Publique (MINFOPRA) lors des concours administratifs, scannent ce QR code. Ils sont redirigés vers le portail de vérification souverain du BUNEC qui confirme l'authenticité de la signature de l'Officier d'état civil.",
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
            Comprendre la gestion numérique de l'état civil au Cameroun, la délivrance des actes et la législation en vigueur (Ordonnance de 1981, Loi de 2011).
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
