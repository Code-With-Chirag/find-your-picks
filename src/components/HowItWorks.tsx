import { Search, Zap, ShoppingBag } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Enter Your Needs",
    description: "Tell us what you're looking for and your budget preferences"
  },
  {
    icon: Zap,
    title: "Get Top 5 Picks",
    description: "Our algorithm finds the best products matching your criteria"
  },
  {
    icon: ShoppingBag,
    title: "Buy with Confidence",
    description: "Choose from curated recommendations and make your purchase"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect product is just three simple steps away
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-border transform -translate-x-1/2">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}