const features = [
  {
    number: "01",
    title: "Gaming accounts only",
    text: "ZenXStore is built specifically for gaming accounts instead of a general digital marketplace.",
  },
  {
    number: "02",
    title: "Admin-controlled listings",
    text: "Only accounts approved and published by the admin appear publicly.",
  },
  {
    number: "03",
    title: "Secure checkout",
    text: "Customers receive a proper order flow instead of being sent directly to random sellers.",
  },
  {
    number: "04",
    title: "Real support",
    text: "Customers can open a support conversation and communicate with the support team.",
  },
];

export default function Features() {
  return (
    <section className="featuresSection">
      <div className="sectionHeader centered">
        <span className="sectionEyebrow">WHY ZENXSTORE</span>
        <h2>Built around gaming.</h2>
        <p>
          Everything on the platform is designed around buying and selling
          gaming accounts.
        </p>
      </div>

      <div className="featuresGrid">
        {features.map((feature) => (
          <article className="featureItem" key={feature.number}>
            <span>{feature.number}</span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
