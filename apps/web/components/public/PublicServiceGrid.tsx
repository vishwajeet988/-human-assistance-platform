"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, formatINR, type Service } from "../../lib/api";
import { Button } from "../ui/Button";

const fallbackServices: Service[] = [
  { id: "hospital", slug: "hospital-companion", name: "Hospital Companion", shortDescription: "Practical, non-medical support for appointments and hospital visits.", longDescription: "A calm extra pair of hands for the practical parts of a hospital or appointment visit.", iconKey: "hand-heart", displayOrder: 1, durationOptionsMinutes: [120, 240, 480], basePriceMinor: 79900, hourlyRateMinor: 39900, customerRequirements: [] },
  { id: "elder", slug: "elder-companion", name: "Elder Companion", shortDescription: "Thoughtful help for parents, elders and everyday appointments.", longDescription: "Arrange respectful company and practical assistance for someone you care about.", iconKey: "sunrise", displayOrder: 2, durationOptionsMinutes: [60, 120, 240], basePriceMinor: 59900, hourlyRateMinor: 29900, customerRequirements: [] },
  { id: "pet", slug: "pet-assistance", name: "Pet Assistance", shortDescription: "Help with vet visits, walks, grooming and pet errands.", longDescription: "Reliable support for the practical moments in your pet's day.", iconKey: "paw", displayOrder: 3, durationOptionsMinutes: [60, 120, 240], basePriceMinor: 49900, hourlyRateMinor: 24900, customerRequirements: [] },
  { id: "everyday", slug: "everyday-assistance", name: "Everyday Assistance", shortDescription: "A dependable hand for errands, documents and appointments.", longDescription: "Practical help for the things that are easier with someone there.", iconKey: "spark", displayOrder: 4, durationOptionsMinutes: [60, 120, 240], basePriceMinor: 39900, hourlyRateMinor: 19900, customerRequirements: [] }
];

export function PublicServiceGrid() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  useEffect(() => { apiFetch<Service[]>("/services").then(setServices).catch(() => undefined); }, []);
  return <div className="public-service-grid">{services.sort((a, b) => a.displayOrder - b.displayOrder).map((service) => <article className="public-service-card" key={service.slug}>
    <div className={`service-art service-art-${service.iconKey}`} aria-hidden="true">{service.iconKey === "paw" ? "✦" : service.iconKey === "sunrise" ? "◒" : service.iconKey === "hand-heart" ? "♡" : "＋"}</div>
    <p className="eyebrow">{(service.durationOptionsMinutes[0] ?? 60) / 60} hour minimum</p><h3>{service.name}</h3><p>{service.shortDescription}</p>
    <div className="service-card-bottom"><span>From {formatINR(service.basePriceMinor)}</span><Link href={`/services/${service.slug}`} aria-label={`Explore ${service.name}`}>Explore <span aria-hidden="true">↗</span></Link></div>
  </article>)}</div>;
}
