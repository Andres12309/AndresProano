import type { AppProps } from "next/app";
import { ProductProvider } from "@/presentation/context";
import "@/presentation/shared/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProductProvider>
      <Component {...pageProps} />
    </ProductProvider>
  );
}
