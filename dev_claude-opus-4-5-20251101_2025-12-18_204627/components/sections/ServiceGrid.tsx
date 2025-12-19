import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export interface Service {
  id?: string;
  title: string;
  description: string;
  features?: string[];
  cta?: {
    text: string;
    href: string;
  };
  icon?: string;
}

interface ServiceGridProps {
  services: Service[];
  columns?: 2 | 3 | 4;
}

export default function ServiceGrid({ services, columns = 3 }: ServiceGridProps) {
  const gridColumns = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridColumns[columns]} gap-6 lg:gap-8`}>
      {services.map((service, index) => (
        <div key={index} id={service.id} className="h-full">
          <Card className="flex flex-col h-full">
            <CardHeader>
              {service.icon && (
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{service.icon}</span>
                </div>
              )}
              <CardTitle as="h3" className="text-xl">
                {service.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <p className="text-gray-600 mb-4">{service.description}</p>

              {service.features && service.features.length > 0 && (
                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {service.cta && (
                <div className="mt-auto">
                  <Link
                    href={service.cta.href}
                    className="btn btn-outline w-full text-center"
                  >
                    {service.cta.text}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
