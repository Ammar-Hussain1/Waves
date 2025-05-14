"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="px-6 lg:px-16 py-10 text-white ">
      <div className="text-left mb-12 ml-4 md:ml-20">
        <h2 className="text-5xl font-extralight text-white mb-2 ml-20">About Us</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-22 mb-10">
        {[
          {
            href: "/aboutus/business",
            image: "/buisness.jpg",
            title: "Our Business",
            description:
              "Waves Airlines redefines modern aviation with a focus on innovation, premium service, and sustainable growth strategies.",
          },
          {
            href: "/aboutus/people",
            image: "/people.jpg",
            title: "Our People",
            description:
              "Behind every flight is a dedicated team — from pilots to ground crew — all working together to elevate your experience.",
          },
          {
            href: "/aboutus/planet",
            image: "/planet.jpg",
            title: "Our Planet",
            description:
              "Waves is committed to greener skies through fuel-efficient aircraft, carbon offset programs, and eco-conscious operations.",
          },
        ].map((card, idx) => (
          <Link href={card.href} key={idx} passHref>
            <div className="w-full md:w-[380px] transform transition-transform ease-in-out hover:scale-110 duration-300 hover:shadow-xl hover:opacity-70">
              <Card className="bg-zinc-900 p-6 cursor-pointer h-full">
                <CardHeader className="flex flex-col items-start p-0 mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
                    <Image
                      src={card.image}
                      alt={`${card.title} Icon`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-gray-400 text-sm">{card.description}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;
