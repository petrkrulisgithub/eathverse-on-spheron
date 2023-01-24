import { signIn, signOut, useSession } from "next-auth/react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import MetaMaskIcon from "../svg/components/MetaMaskIcon";
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";

function Header({ words }) {
  const { data: session } = useSession();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();

  console.log(session);

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const userData = { address: account, chain: chain.id, network: "evm" };

    const { data } = await axios.post("/api/auth/request-message", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const message = data.message;

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    const { url } = await signIn("credentials", {
      message,
      signature,
      redirect: false,
    });
    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    push(url);
  };

  const renderWalletAddress = () => {
    const firstSixSymbols = session.user.address.slice(0, 6);
    const lastFourSymbols = session.user.address.slice(38, 42);

    return `${firstSixSymbols}...${lastFourSymbols}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-[401]">
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5  dark:bg-gray-900">
        <div className="container flex justify-between items-center mx-auto">
          <a href="#" className="flex items-center">
            <svg
              className="mr-3 h-6 sm:h-9"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              style={{ enableBackground: "new 0 0 512 512" }}
              xmlSpace="preserve"
            >
              {" "}
              <path
                style={{ fill: "#127C8D" }}
                d="M256,0l-22.505,253.654L256,512c141.385,0,256-114.615,256-256S397.385,0,256,0z"
              />{" "}
              <path
                style={{ fill: "#FFD15D" }}
                d="M256,33.758l-22.505,219.896L256,478.242c122.74,0,222.242-99.501,222.242-222.242 S378.74,33.758,256,33.758z"
              />{" "}
              <path
                style={{ fill: "#FF9E46" }}
                d="M256,93.514l-22.505,160.14L256,418.486c89.596,0,162.486-72.891,162.486-162.486 S345.596,93.514,256,93.514z"
              />{" "}
              <path
                style={{ fill: "#FF7226" }}
                d="M256,153.269l-22.505,100.384L256,358.73c56.646,0,102.731-46.085,102.731-102.731 S312.646,153.269,256,153.269z"
              />{" "}
              <path
                style={{ fill: "#BD0D38" }}
                d="M256,203.907l-22.505,49.747L256,308.093c28.77,0,52.093-23.322,52.093-52.093 C308.093,227.23,284.77,203.907,256,203.907z"
              />{" "}
              <path
                style={{ fill: "#4BBCD6" }}
                d="M183.601,10.382c-23.241,6.839-45.108,16.889-65.088,29.634c0.151-0.095,0.299-0.179,0.451-0.275 l-75.649,73.735C15.961,154.214,0,203.243,0,256c0,47.007,12.682,91.046,34.792,128.907L178.516,500.05 C202.96,507.804,228.989,512,256,512V73.143L183.601,10.382z"
              />{" "}
              <g>
                {" "}
                <path
                  style={{ fill: "#127C8D" }}
                  d="M170.767,369.222H145.66v-7.124c0-30.615-24.819-55.433-55.433-55.433 c-5.033,0-9.905,0.683-14.541,1.94v-30.307c9.047-3.415,15.493-12.129,15.493-22.372v-18.757c3.424,0.881,34.311,0.58,54.238,0.286 v10.967c0,4.661,3.778,8.44,8.44,8.44s8.44-3.779,8.44-8.44V120.196c11.346-4.195,19.436-15.109,19.436-27.914 c0-16.432-13.321-29.753-29.753-29.753h-5.247l-27.768-22.788c-30.039,19.076-55.834,44.232-75.649,73.745v142.44 c0,10.242,6.446,18.956,15.493,22.372v38.137c-14.503,9.998-24.014,26.716-24.014,45.664v22.809 c31.687,54.258,82.758,95.805,143.723,115.144v-56.437c17.046-3.573,29.848-18.686,29.848-36.794 C208.364,386.055,191.531,369.222,170.767,369.222z"
                />{" "}
                <path
                  style={{ fill: "#127C8D" }}
                  d="M127.204,261.524c-4.662,0-8.44,3.779-8.44,8.44v3.335c0,4.661,3.778,8.44,8.44,8.44 c4.662,0,8.44-3.779,8.44-8.44v-3.335C135.644,265.303,131.866,261.524,127.204,261.524z"
                />{" "}
              </g>{" "}
              <path
                style={{ fill: "#FFFFFF" }}
                d="M183.607,10.399c5.05,35.469,35.529,62.744,72.393,62.744V0C230.855,0,206.563,3.643,183.607,10.399z "
              />{" "}
              <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
              <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
              <g> </g>{" "}
            </svg>
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Earthverse
            </span>
          </a>
          <div className="flex">
            <div className="hidden relative md:block w-[40rem]">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Search icon</span>
              </div>
              <input
                type="text"
                id="search-navbar"
                defaultValue={words}
                className="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="justify-between items-center flex flex-row-reverse  md:order-1">
            {!session ? (
              <div>
                <button
                  type="button"
                  onClick={handleAuth}
                  className=" text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                >
                  <div className="inline-flex">
                    <span className="px-2">Login with Metamask</span>
                    <MetaMaskIcon />
                  </div>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signOut()}
                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
              >
                <span className="px-2">{renderWalletAddress()}</span>
                <span className="px-2">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
