import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Footer from "../BodySection/Footer";
import MobileNav from "../heroSection/MobileNav";
import Navbar from "../heroSection/Navbar";

const schema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(20),
});

type contactFields = z.infer<typeof schema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<contactFields>({
    resolver: zodResolver(schema),
  });

  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (filesArray.length + images.length > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }

      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const submitMessage: SubmitHandler<contactFields> = async (data) => {
    const imagesBase64 = await Promise.all(images.map(image => convertFileToBase64(image)));

    const payload = {
      ...data,
      images: imagesBase64
    };

    // Log the payload to check its structure
    console.log(payload);

    // Assuming you're using fetch to send the payload
    
      reset();
        setImages([]);
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <MobileNav />
      <div className="h-28 bg-[url('public/images/ashley-gorringe-1IxQ2rDrxds-unsplash.jpg')] bg-no-repeat bg-cover flex justify-center items-center mb-14">
        <p className="font-bold text-3xl">Contactez nous</p>
      </div>

      <div className="flex justify-center mb-20">
        <section className="bg-greyThree p-8">
          <h3>Besoin d'aide ?</h3>
          <p className="mb-4">
            Nous aimerions connaitre votre besoin, Prenez contact avec nous!
          </p>
          <form className="flex flex-col" onSubmit={handleSubmit(submitMessage)}>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm">Nom</label>
                <input {...register("nom")} type="text" className="input" />
                {errors.nom && (
                  <p className="text-greyLink text-sm">{errors.nom.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm">Prenom</label>
                <input {...register("prenom")} type="text" className="input" />
                {errors.prenom && (
                  <p className="text-greyLink text-sm">{errors.prenom.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm">Email</label>
                <input {...register("email")} type="email" className="input" />
                {errors.email && (
                  <p className="text-greyLink text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm">Message</label>
                <textarea {...register("message")} className="inputpub resize-none w-full h-[175px]" />
                {errors.message && (
                  <p className="text-greyLink text-sm">{errors.message.message}</p>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <div className="flex flex-wrap">
                {images.map((image, index) => (
                  <div key={index} className="relative mr-2 mb-2">
                    <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-32 h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="btn self-end mt-10 px-10 bg-orange text-white"
            >
              Envoyer
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
