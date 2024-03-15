"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase.types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import DesoAPI from "@/lib/deso";
import { Toaster, toast } from "sonner";

import ModalContext from "@/context/ModalContext";
import OnboardModal from "@/components/Modal/Onboard";

import Link from "next/link";

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

export const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createPagesBrowserClient());
  const [isOpen, setIsOpen] = useState(false);

  const { onboard } = useContext(ModalContext);

  const [onboardOpen, setOnboardOpen] = onboard;

  const router = useRouter();
  const DeSo = new DesoAPI();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });

    supabase.auth.getSession().then((res) => {
      const desoActivePublicKey = localStorage.getItem("deso_user_key");
      if (!res.data.session || !desoActivePublicKey) {
        setIsOpen(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function signUpWithDeso() {
    const desoActivePublicKey = localStorage.getItem("deso_user_key");
    const response = await DeSo.getSingleProfileFK(
      desoActivePublicKey as string
    );

    if (response) {
      const userData: string =
        typeof response === "string" ? response : JSON.stringify(response);
      localStorage.setItem("userInfo", userData);
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("deso_key", `"${desoActivePublicKey}"`);

    if (error && error.message != "User already registered") {
      return toast.error(error.message);
    }

    // Account already exists
    if (data && data?.length > 0) {
      if (desoActivePublicKey) {
        const credentials = {
          email: `${desoActivePublicKey}@evasocial.app`,
          password: desoActivePublicKey,
        };

        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) {
          return toast.error(error.message);
        } else {
          setIsOpen(false);
          router.push("/");
          return;
        }
      } else {
        console.log("Error user not logged in on DeSo");
      }
    } else {
      if (desoActivePublicKey) {
        const credentials = {
          email: `${desoActivePublicKey}@evasocial.app`,
          password: desoActivePublicKey,
          options: {
            data: {
              id: desoActivePublicKey,
              deso_key: desoActivePublicKey,
            },
          },
        };

        const { error } = await supabase.auth.signUp(credentials);

        if (error) {
          return toast.error(error.message);
        } else {
          const SERVER_ENDPOINT =
            process.env.SERVER_ENDPOINT || "http://localhost:3000";

          const response = await fetch(
            `${SERVER_ENDPOINT}/api/user/storeDeSoKey`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                deso_key: desoActivePublicKey,
              }),
            }
          );
          setIsOpen(false);
          setOnboardOpen(true);
        }
      } else {
        return toast.error("Authentication Failed");
      }
    }
  }

  return (
    <Context.Provider value={{ supabase }}>
      {/* Toaster To Display Messages */}
      <Toaster />

      {/* Authenticate Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="bg-background p-6 space-y-2">
            <h3 className="text-lg my-1">Please sign in to continue</h3>

            <p>
              Eva Social utilizes the DeSo blockchain to ensure the
              decentralization of content as well as offer you exclusive
              features.{" "}
            </p>
            <div className="flex w-full justify-end">
              <Button
                onClick={async () => {
                  await DeSo.login();
                  signUpWithDeso();
                }}
                className="bg-white text-background rounded-lg hover:bg-black hover:text-white hover:outline-white hover:outline"
              >
                Continue With DeSo
              </Button>
            </div>
            <br></br>
            <p className="mt-2">
              By creating an account you agree to our{" "}
              <Link href={"/boring/terms-of-service"} className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={"/privacy-policy"} className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <OnboardModal />

      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
};
