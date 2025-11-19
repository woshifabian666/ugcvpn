export const dynamic = "force-dynamic";

"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const PLANS = [
  {
    name: "1 VPN Key",
    price: "$2 / month",
    url: "https://buy.stripe.com/dRm4gB43r4uR9A7f904ZG01",
  },
  {
    name: "10 VPN Keys",
    price: "$10 / month",
    url: "https://buy.stripe.com/6oU00larP1iFdQnd0S4ZG02",
  },
  {
    name: "50 VPN Keys",
    price: "$40 / month",
    url: "https://buy.stripe.com/4gMeVf0RfbXj3bJ7Gy4ZG03",
  },
];

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [keys, setKeys] = useState([]);

  // Fetch subscription + keys
  useEffect(() => {
    if (!isLoaded || !user) return;

    const email = user.primaryEmailAddress.emailAddress;

    async function loadData() {
      try {
        const subRes = await fetch(
          `http://localhost:3000/api/subscription?email=${email}`
        );
        const subData = await subRes.json();
        setSubscription(subData);

        const keyRes = await fetch(
          `http://localhost:3000/api/keys?email=${email}`
        );
        const keyData = await keyRes.json();
        setKeys(keyData.keys || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }

      setLoading(false);
    }

    loadData();
  }, [user, isLoaded]);

  // Loading screen
  if (!isLoaded || loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#EDEDED]">
        <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // No subscription yet → show plans
  if (!subscription?.active) {
    return (
      <div className="min-h-screen bg-[#EDEDED] p-8">
        <h1 className="text-3xl font-bold mb-6">Choose Your Plan</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-gray-700 mb-4">{plan.price}</p>

              <a
                href={plan.url}
                className="block text-center bg-black text-white px-4 py-2 rounded-lg"
              >
                Subscribe
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Subscription active but ZERO keys → payment failed
  if (subscription.active && keys.length === 0) {
    return (
      <div className="min-h-screen bg-[#EDEDED] p-8">
        <h1 className="text-3xl font-bold mb-4">Subscription Issue</h1>
        <p className="mb-6 text-red-600">
          Your payment succeeded, but no VPN key was generated.  
          This usually means the Outline server rejected the request.
        </p>

        <a
          href="https://billing.stripe.com/p/login/14AfZj0Rf8L7fYv5yq4ZG00"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Manage Subscription
        </a>
      </div>
    );
  }

  // Subscription active → show keys
  return (
    <div className="min-h-screen bg-[#EDEDED] p-8">
      <h1 className="text-3xl font-bold mb-6">Your VPN Keys</h1>

      <div className="space-y-4 mb-8">
        {keys.map((key, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow">
            <p className="font-mono break-all">{key.accessUrl || key.key}</p>
          </div>
        ))}
      </div>

      <a
        href="https://billing.stripe.com/p/login/14AfZj0Rf8L7fYv5yq4ZG00"
        className="bg-black text-white px-4 py-3 rounded-lg"
      >
        Manage Subscription
      </a>
    </div>
  );
}
