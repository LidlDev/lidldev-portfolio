
import React from "react";
import { User, Star, Award, Calendar } from "lucide-react";
import { IMAGE_PATHS } from "../config/images";
import LazyImage from "./LazyImage";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, Parallax } from "./animations";
import { StatsCard, FeatureCard } from "./ui/ModernCards";

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            className="md:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block">
              <h2 className="text-3xl md:text-4xl font-display font-bold relative">
                About Me
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-accent rounded-full"></span>
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground">
              I'm a passionate developer focused on creating modern, user-friendly web and mobile experiences. 
              With a strong foundation in front-end and back-enddevelopment and an eye for design, I craft 
              interfaces that are both beautiful and functional.
            </p>
            
            <p className="text-lg text-muted-foreground">
              My journey in tech began with a curiosity about how websites and apps work, which evolved into 
              a career building cutting-edge applications. I love solving complex problems and turning 
              ideas into reality through programming.
            </p>
            
            <StaggerContainer className="grid grid-cols-2 gap-4 pt-6">
              <StaggerItem>
                <StatsCard
                  label="Experience"
                  value="5+ Years"
                  icon={<User className="w-5 h-5" />}
                  change={{ value: 25, type: 'increase' }}
                />
              </StaggerItem>

              <StaggerItem>
                <StatsCard
                  label="Projects"
                  value="20+"
                  icon={<Star className="w-5 h-5" />}
                  change={{ value: 15, type: 'increase' }}
                />
              </StaggerItem>

              <StaggerItem>
                <StatsCard
                  label="Education"
                  value="CS Degree"
                  icon={<Award className="w-5 h-5" />}
                />
              </StaggerItem>

              <StaggerItem>
                <StatsCard
                  label="Availability"
                  value="Open"
                  icon={<Calendar className="w-5 h-5" />}
                />
              </StaggerItem>
            </StaggerContainer>
          </motion.div>

          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <LazyImage
                  src={IMAGE_PATHS.PROFILE.HARRY}
                  alt="Harry - Full Stack Developer and Software Engineer"
                  className="w-full h-full object-cover"
                  loading="eager"
                  placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhhcnJ5PC90ZXh0Pjwvc3ZnPg=="
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl glass-card p-4 flex flex-col justify-center animate-float">
                <h3 className="font-display font-bold text-2xl text-primary">5+</h3>
                <p className="text-sm text-muted-foreground">Years of Experience</p>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
