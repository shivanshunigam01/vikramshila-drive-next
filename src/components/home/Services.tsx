import {
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Package,
  Route,
  Users,
  Truck,
  Activity,
} from "lucide-react";

export default function Services() {
  return (
    <section className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&crop=center')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Unparalleled After Sales Services
              <br />
              by Tata Motors
            </h1>
            <p className="text-xl leading-relaxed opacity-90">
              It is our constant endeavour to minimise downtime, decrease the
              cost of service and to address the concerns of our customers. We
              provide a variety of offerings like Suvidha Service Vans, Mobile
              Service Vans, Workshops of Dealers and TASSs in every nook and
              corner of the country.
            </p>
          </div>
        </div>
      </div>

      {/* Add-On Services Title */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Add-On Services for
            <br />
            Your Product Purchase
          </h2>
        </div>

        {/* Fleet Edge Service */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center"
                alt="Fleet Edge"
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute top-6 left-6">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg">
                  Fleet Edge
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=60&h=60&fit=crop&crop=center"
                  alt="Fleet Edge Logo"
                  className="w-12 h-12 rounded"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Jankari hogi Tabhi toh tarakki hogi
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Get live updates on vehicle movement remotely on Fleet Edge
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                From impactful decision-making to future planning, everything
                needs relevant information provided in real-time. Tata Motors
                FleetEdge with its in-house, state-of-the-art connected platform
                technology, provides your business with every need in the way of
                building a stronger, data-driven, real-time business with a
                focus on providing better decision-making for greater success to
                your business.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    1.59L+
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    3.74L+
                  </div>
                  <div className="text-sm text-gray-600">Total Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    456M+
                  </div>
                  <div className="text-sm text-gray-600">User Events</div>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Know More →
              </button>
            </div>
          </div>
        </div>

        {/* Suraksha AMC Service */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                About Suraksha Annual Maintenance Contract (AMC)
              </h3>
              <h4 className="text-xl font-semibold text-blue-600 mb-6">
                About Fleet Management System (FMS)
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The AMC Service from Tata Motors Limited is known as Suraksha
                and it ensures that the customer can focus entirely on his core
                business while leaving work related to vehicle maintenance to
                the experts at Tata Motors.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Tata Motors offers an Annual Maintenance Contract (AMC) to
                commercial vehicle buyers, which provides maintenance and repair
                services to the customer at specified National Highways through
                the service outlets of its authorised dealers or Tata Authorised
                Service Stations (TASS).
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                The AMC covers scheduled maintenance services at periodic
                intervals of kilometres for labour, parts, and consumables, as
                recommended by Tata Motors, at intervals indicated in the
                service schedule to the extent the customer is liable to pay
                under the Free Services scheme.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                There are different types of AMC plans available for Tata
                vehicles, such as Silver, Gold, and P2P (Pay to Protect). The
                AMC is a maintenance plan that guarantees protection against
                unexpected repairs and provides substantial savings through
                scheduled maintenance services.
              </p>

              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Know More →
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop&crop=center"
                alt="Suraksha AMC"
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute top-6 right-6">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=60&h=60&fit=crop&crop=center"
                    alt="Suraksha Logo"
                    className="w-12 h-12 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sampoorna Seva 2.0 */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop&crop=center"
                alt="Sampoorna Seva 2.0"
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute top-6 left-6">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=60&h=60&fit=crop&crop=center"
                    alt="Sampoorna Seva Logo"
                    className="w-12 h-12 rounded"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Sampoorna Seva 2.0
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                When you buy a Tata Motors Truck, you are buying not just a
                product, but a universe of services that includes everything
                from service, roadside assistance, insurance, loyalty and a
                whole lot more. You can now focus wholeheartedly on your
                business, and let SampoornaSeva take care of the rest.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sampoorna Seva 2.0 is all-new and enhanced. We have collected
                feedback from over 6.5 million customers who've visited our
                centres in the last year to create this continuously improving
                holistic service.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You will benefit from the assistance of over 1500 Channel
                Partners covering 29 State Service Offices, 250+ Tata Motors
                Engineers, modern equipment & facilities and 24x7 Mobile Vans.
              </p>

              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Know More →
              </button>
            </div>
          </div>
        </div>

        {/* Tata Fleetcare */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Tata Fleetcare
              </h3>
              <h4 className="text-xl font-semibold text-blue-600 mb-6">
                Care Lagataar rahe Fleet Tayyaar rahe
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Does a basic manufacturer's warranty truly protect your
                commercial fleet? Standard coverage only addresses factory
                defects, leaving your operations vulnerable to unpredictable
                maintenance costs.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Tata Motors Fleet Care offers a comprehensive suite of products
                like Suraksha Annual Maintenance Contract (AMC), Fleet
                Management Solutions (FMS), On-site Support and Extended
                Warranty to truly safeguard your vehicles and operations.
                Tailored plans combat breakdowns, reduce unplanned maintenance,
                and ensure maximum vehicle uptime—ultimately boosting resale
                value while ensuring maintenance costs are predictable.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Opt for Tata Motors Fleet Care solutions today and Karo business
                tension free.
              </p>

              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Know More →
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop&crop=center"
                alt="Tata Fleetcare"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Value-Added Services for Every Owner
          </h2>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                For any assistance, call now
              </h3>
              <p className="opacity-90">
                Our Customer Service Assistance is available 24x7. We ensure
                quick service availability at the authorized dealerships in
                India.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold">📞 1800 209 7979</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
