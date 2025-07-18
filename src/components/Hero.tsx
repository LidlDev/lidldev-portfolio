import * as React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { scrollToElement } from "../utils/scrollUtils";
import { fadeInUp, fadeInLeft, staggerContainer, staggerItem } from "../utils/animations";
import AnimatedButton from "./AnimatedButton";
import { useCMS } from "../hooks/useCMS";

const Hero: React.FC = () => {
  const { getHeroContent, loading, error } = useCMS();

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div>Error loading content: {error}</div>
      </section>
    );
  }

  const heroContent = getHeroContent();
  const phrases = heroContent?.taglines || [
    "Crafting Digital Experiences",
    "Designing Mobile Interfaces",
    "Building ML-Powered Solutions",
    "Creating Intuitive UI/UX"
  ];
  
  const [text, setText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [delta, setDelta] = React.useState(200 - Math.random() * 100);
  
  React.useEffect(() => {
    const ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, isDeleting, phraseIndex, delta]);

  const tick = () => {
    const currentPhrase = phrases[phraseIndex];
    const updatedText = isDeleting
      ? currentPhrase.substring(0, text.length - 1)
      : currentPhrase.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(30); // Much faster deletion speed
    }

    if (!isDeleting && updatedText === currentPhrase) {
      // Pause at complete phrase
      setDelta(2000);
      setIsDeleting(true);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      setDelta(500);
    } else if (isDeleting) {
      setDelta(30); // Consistent fast deletion
    } else {
      setDelta(200 - Math.random() * 100);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    scrollToElement(sectionId);
  };
  
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-16 overflow-hidden relative pattern-bg"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-40 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
        animate={{
          y: [-20, 20, -20],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
        animate={{
          y: [20, -20, 20],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-20">
        <motion.div
          className="flex flex-col gap-8 max-w-4xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="space-y-2" variants={staggerItem}>
            <motion.p
              className="text-lg md:text-xl font-medium text-primary"
              variants={fadeInLeft}
            >
              {heroContent?.greeting || "Hello, I'm"}
            </motion.p>
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-balance"
              variants={fadeInUp}
            >
              <motion.span
                className="magic-text"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              >
                {heroContent?.name || "Harry"}
              </motion.span>
              <br />
              <span className="relative">
                {text}
                <motion.span
                  className="absolute -right-2"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  |
                </motion.span>
              </span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl"
              variants={fadeInUp}
            >
              {heroContent?.description || "I build beautiful, interactive web applications with modern technologies. Turning ideas into exceptional digital experiences."}
            </motion.p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={staggerItem}
          >
            <AnimatedButton
              variant="magnetic"
              size="lg"
              onClick={() => {
                const e = { preventDefault: () => {} } as React.MouseEvent<HTMLAnchorElement>;
                handleNavClick(e, heroContent?.primaryButton?.url || "#projects");
              }}
              className="rounded-full"
            >
              {heroContent?.primaryButton?.text || "View My Work"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="lg"
              onClick={() => {
                const e = { preventDefault: () => {} } as React.MouseEvent<HTMLAnchorElement>;
                handleNavClick(e, heroContent?.secondaryButton?.url || "#contact");
              }}
              className="rounded-full border border-primary text-primary hover:bg-primary/10"
            >
              {heroContent?.secondaryButton?.text || "Contact Me"}
            </AnimatedButton>
          </motion.div>
          <motion.div
            className="mt-12 text-center sm:text-left"
            variants={staggerItem}
          >
            <motion.a
              href="#about"
              onClick={(e) => handleNavClick(e, "#about")}
              className="text-sm text-muted-foreground flex flex-col items-center sm:items-start cursor-pointer group"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span>{heroContent?.scrollText || "Scroll down"}</span>
              <motion.svg
                className="w-6 h-6 mt-2 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </motion.svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;