'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogIn, Camera, Users, Share2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { toast } from "sonner";

export default function HomePage() {
  const { scrollY } = useScroll();
  const padroeiroRef = useRef(null);
  const isPadroeiroInView = useInView(padroeiroRef, { once: true, margin: "-100px" });
  const logoSize = useTransform(scrollY, [0, 300], [240, 100]);
  const logoY = useTransform(scrollY, [0, 300], [40, 80]);
  const logoOpacity = useTransform(scrollY, [0, 250], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'PASCOM Mineirolândia',
      text: 'Confira o portal da PASCOM da Paróquia de Mineirolândia!',
      url: url,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado!", {
          description: "Área de transferência atualizada.",
          icon: <Share2 className="w-4 h-4 text-cyan-500" />,
        });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error(err);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -100;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  };

  return (
      <div className="min-h-screen bg-[#020202] text-white overflow-x-hidden selection:bg-cyan-500/30">

        <header className="fixed top-0 w-full z-[100] px-4 sm:px-6 py-3 sm:py-4 bg-black/40 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
            >
              <div className="relative w-32 h-10">
                <Image src="/assets/brasao-pascom.png" alt="PASCOM" fill className="object-contain" />
              </div>
              <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
              <span className="font-black italic tracking-tighter text-lg uppercase hidden sm:block text-cyan-500">
              MINEIROLÂNDIA
            </span>
            </motion.div>

            <nav className="flex items-center gap-6 text-[10px] md:text-sm font-bold uppercase tracking-widest text-gray-400">
              <button
                  onClick={() => scrollToSection('sobre')}
                  className="hover:text-cyan-500 transition-colors hidden md:block"
              >
                Sobre
              </button>
              <button
                  onClick={() => scrollToSection('padroeiro')}
                  className="hover:text-cyan-500 transition-colors hidden md:block"
              >
                Padroeiro
              </button>
              <Link href="/login">
                <Button className="group relative overflow-hidden bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl px-6 font-black italic transition-all shadow-lg shadow-cyan-900/40">
                  <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 3 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                  <LogIn className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">LOGIN</span>
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        <section className="relative min-h-[100svh] md:h-screen flex flex-col items-center justify-center overflow-hidden">
          <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0">
            <Image
                fill
                priority
                src="/assets/igreja-fundo.jpeg"
                alt="Paróquia Mineirolândia"
                className="object-cover opacity-40 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#020202]/60 to-[#020202]" />
          </motion.div>

          <motion.div
              style={{ width: logoSize, y: logoY, opacity: logoOpacity }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="z-50 relative pointer-events-none"
          >
            <Image
                width={400}
                height={400}
                src="/assets/brasao-paroquia.png"
                alt="Brasão Paroquial"
                className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(6,182,212,0.3)]"
            />
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center z-10 mt-8 space-y-6 px-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em]">Nossa Senhora do Perpétuo Socorro</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-[0.9] sm:leading-[0.85]">
              VOZ DA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-700">MISSÃO</span>
            </h1>
            <p className="max-w-xl mx-auto text-gray-400 font-medium text-lg md:text-xl">
              Evangelizando através da tecnologia e unindo corações para o Reino.
            </p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="pt-12">
              <ChevronDown className="w-10 h-10 mx-auto text-cyan-500/50" />
            </motion.div>
          </motion.div>
        </section>

        <section id="sobre" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
            >
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                O SANGUE QUE <br /><span className="text-cyan-500">MOVE A IGREJA</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-xl font-light">
                A PASCOM não é apenas uma pastoral de fotos, é o eixo que garante que a <span className="text-white font-bold italic underline decoration-cyan-500 underline-offset-4">Mensagem</span> flua por todos os canais da nossa paróquia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { icon: <Users />, title: "União", desc: "Integramos movimentos e pessoas." },
                  { icon: <Camera />, title: "Anúncio", desc: "A imagem a serviço do Evangelho." }
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                        whileTap={{ scale: 0.97 }}
                        className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] transition-all"
                    >
                      <div className="text-cyan-500 w-10 h-10 mb-4">{card.icon}</div>
                      <h4 className="font-black uppercase text-sm tracking-widest mb-2">{card.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                    </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group cursor-none"
            >
              <div className="absolute -inset-4 bg-cyan-600/20 rounded-[3.5rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative aspect-[5/4] lg:aspect-[4/3] rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <Image
                    fill
                    src="/assets/equipe-pascom.jpeg"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt="Equipe PASCOM"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10">
                <span className="px-4 py-1 bg-cyan-600 text-[10px] font-black uppercase rounded-full">Equipe 2026</span>
                  <h3 className="text-2xl font-black italic uppercase mt-2">Mineirolândia em Foco</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="padroeiro" ref={padroeiroRef} className="py-32 relative overflow-hidden bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={isPadroeiroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative h-[360px] sm:h-[500px] lg:h-[700px] rounded-[4rem] overflow-hidden group shadow-2xl"
            >
              <Image fill src="/assets/carlo-acutis.jpeg" alt="São Carlo Acutis" className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isPadroeiroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
            >
              <div className="w-20 h-1 bg-cyan-500 rounded-full" />
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
                SÃO CARLO <br /><span className="text-cyan-500">ACUTIS</span>
              </h2>
              <p className="text-2xl text-gray-300 italic font-medium border-l-4 border-cyan-500 pl-6">
                &#34;A Eucaristia é a minha autoestrada para o céu.&#34;
              </p>
              <p className="text-gray-500 text-lg leading-relaxed">
                O ciberapóstolo que santificou a internet. Carlo Acutis é o farol que guia nossa PASCOM, mostrando que o mundo digital é um solo sagrado para a evangelização.
              </p>
              <Link href="https://www.carloacutis.com/" target="_blank">
                <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-whiterounded-2xl font-black uppercase tracking-widestpx-6 py-4 sm:px-10 sm:py-8transition-all hover:border-cyan-500"
                >
                EXPLORAR HISTÓRIA
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <motion.div whileHover={{ scale: 1.05 }} className="relative w-36 sm:w-48 h-10 sm:h-12">
                <Image
                    src="/assets/brasao-pascom.png"
                    fill
                    alt="PASCOM"
                    className="object-contain"
                />
              </motion.div>

              <div className="flex gap-4">
                <a
                    href="https://instagram.com/paroquia.mineirolandia"
                    target="_blank"
                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-cyan-600 hover:-translate-y-1 transition-all shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                </a>

                <button
                    onClick={handleShare}
                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-cyan-600 hover:-translate-y-1 transition-all shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.35em]">
                Paróquia Nossa Senhora do Perpétuo Socorro
              </p>
              <p className="text-cyan-500/50 text-[9px] font-black uppercase tracking-[0.2em]">
                Mineirolândia · Ceará
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-800 text-[9px] font-black uppercase tracking-[0.3em]">
                © 2026 Ad Maiorem Dei Gloriam
              </p>
            </div>

          </div>
        </footer>
        </div>
    );
}