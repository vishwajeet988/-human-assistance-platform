"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, formatINR, type Service } from "../../lib/api";
import { Button } from "../ui/Button";
import { Card } from "../ui/Surface";
import { Notice } from "../ui/Feedback";

export function ServiceCatalog() {
  const [services, setServices] = useState<Service[]>([]); const [error, setError] = useState("");
  useEffect(() => { apiFetch<Service[]>("/services").then(setServices).catch((cause: Error) => setError(cause.message)); }, []);
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!services.length) return <div className="catalog-grid"><Card><p className="eyebrow">Loading services</p><h2>Finding the right kind of help…</h2><p className="muted">Our service guide will be ready in a moment.</p></Card></div>;
  return <div className="catalog-grid">{services.map((service) => <Card key={service.id} className="service-card"><div className="service-icon" aria-hidden="true">{service.iconKey === "paw" ? "⌁" : service.iconKey === "sunrise" ? "◌" : service.iconKey === "hand-heart" ? "♡" : "✦"}</div><p className="eyebrow">{service.durationOptionsMinutes.length} duration options</p><h2>{service.name}</h2><p className="card-copy">{service.shortDescription}</p><p className="service-price">From {formatINR(service.basePriceMinor)} <span>· estimated</span></p><div className="service-actions"><Link href={`/customer/services/${service.slug}`}><Button variant="secondary" size="sm">Explore service</Button></Link><Link href={`/customer/bookings/new?service=${service.slug}`}><Button size="sm">Book</Button></Link></div></Card>)}</div>;
}

export function ServiceDetail({ slug }: { slug: string }) {
  const [service, setService] = useState<Service | null>(null); const [error, setError] = useState("");
  useEffect(() => { apiFetch<Service>(`/services/${slug}`).then(setService).catch((cause: Error) => setError(cause.message)); }, [slug]);
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!service) return <Card><p className="muted">Loading service details…</p></Card>;
  return <><div className="detail-hero"><div><p className="eyebrow">Service guide</p><h1>{service.name}</h1><p className="lede">{service.longDescription}</p><Link href={`/customer/bookings/new?service=${service.slug}`}><Button size="lg">Book this service <span aria-hidden="true">↗</span></Button></Link></div><div className="detail-price"><span>Estimated starting point</span><strong>{formatINR(service.basePriceMinor)}</strong><small>Final estimate depends on duration. No payment is collected yet.</small></div></div><div className="detail-columns"><Card eyebrow="Included" title="What this helps with"><p className="card-copy">Practical accompaniment, clear communication, and respectful support within the service description.</p><ul className="clean-list"><li>Non-medical assistance</li><li>Updates about the service request</li><li>Customer-controlled requirements</li></ul></Card><Card eyebrow="Please note" title="What this does not include"><p className="card-copy">This service does not provide diagnosis, treatment, nursing, injections, clinical monitoring, or emergency medical services.</p><p className="muted">For emergencies, contact the appropriate local emergency service.</p></Card><Card eyebrow="Choose your pace" title="Duration options"><div className="duration-list">{service.durationOptionsMinutes.map((minutes) => <span key={minutes}>{minutes / 60} {minutes === 60 ? "hour" : "hours"}</span>)}</div></Card><Card eyebrow="Before you book" title="What we’ll ask for"><ul className="clean-list">{service.customerRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul><p className="muted">Please avoid entering unnecessary medical, financial, or identity information.</p></Card></div></>;
}
