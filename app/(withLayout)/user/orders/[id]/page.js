import TrackingCode from "@/app/components/orders/TrackingCode";
import { dhakaSuburbs } from "@/app/data/cities";
import { orders } from "@/app/data/orders";
import { shippingCharges } from "@/app/data/shippingCharges";
import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";
import { redirect } from "next/navigation";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { LuArrowLeft, LuDownload } from "react-icons/lu";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

export default function ProductDetails({ params }) {
  const order = orders.find((order) => order.id === params.id);

  const calculateSubtotal = () => {
    return order.items.reduce(
      (accumulator, item) =>
        (item.discount || item.price) * item.selectedQuantity + accumulator,
      0,
    );
  };

  const calculateDiscount = () => {
    if (!order.promo) return 0;
    else if (order.promo.discountType === "flat")
      return order.promo.discountAmount;
    else return (order.promo.discountAmount / 100) * calculateSubtotal();
  };

  const calculateShippingCharge = () => {
    if (order.delivery.city === "Dhaka") return shippingCharges.insideDhaka;
    else if (dhakaSuburbs.includes(order.delivery.city))
      return shippingCharges.dhakaSuburbs;
    else if (hillTractsArea.includes(order.delivery.city))
      return shippingCharges.hillTractsArea;
    else return shippingCharges.outsideDhaka;
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() - calculateDiscount() + calculateShippingCharge()
    );
  };

  if (!order) redirect("/user/orders");

  return (
    <section className="bottom-5 top-5 grow auto-rows-max rounded-xl bg-white p-3.5 shadow-[2px_2px_20px_0_rgba(0,0,0,0.075)] lg:sticky xl:p-5">
      <TransitionLink
        href="/user/orders"
        className="mb-5 flex h-fit items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-[color] duration-300 ease-in-out hover:text-neutral-700"
      >
        <HiArrowNarrowLeft className="size-[18px]" />
        Go back
      </TransitionLink>
      <div className="mb-7 items-start justify-between gap-2 max-sm:space-y-2 sm:flex">
        <div>
          <h1 className="mb-1 text-lg font-bold md:text-xl">
            Order #{order.id}
          </h1>
          <p className="text-xs lg:text-[13px]">
            {order.date}, {order.time}
          </p>
        </div>
        <div
          className={`h-fit w-fit text-nowrap rounded-md px-3 py-2 text-xs font-semibold max-sm:ml-auto ${order.status.bgColor} ${order.status.textColor}`}
        >
          {order.status.text}
        </div>
      </div>
      <div className="max-sm:space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">
        <div>
          <div className="mb-4 h-fit w-full rounded-md border-2 border-neutral-200 p-3.5 text-sm xl:p-5">
            <h2 className="mb-3 text-sm font-semibold md:text-base">
              Customer Details
            </h2>
            <div className="space-y-1 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold sm:[&_h4]:text-nowrap">
              <div>
                <h4>Name</h4>
                <p className="text-right">{order.customer.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p className="flex flex-wrap justify-end text-right max-sm:flex-col">
                  <span>{order.customer.email.split("@")[0]}</span>@
                  {order.customer.email.split("@")[1]}
                </p>
              </div>
              <div>
                <h4>Phone</h4>
                <p className="text-right">{order.customer.phone}</p>
              </div>
            </div>
          </div>
          <div className="mb-4 h-fit w-full rounded-md border-2 border-neutral-200 p-3.5 text-sm xl:p-5">
            <h2 className="mb-3 text-sm font-semibold md:text-base">
              Shipment Details
            </h2>
            <div className="space-y-1 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold sm:[&_h4]:text-nowrap">
              <div>
                <h4>Courier</h4>
                <p className="text-right">
                  {!order.shipment ? "--" : order.shipment.courier}
                </p>
              </div>
              <div>
                <h4>Shipped at</h4>
                <p className="text-right">
                  {!order.shipment
                    ? "--"
                    : `${order.shipment.date}, ${order.shipment.time}`}
                </p>
              </div>
              {!!order.shipment && (
                <TrackingCode trackingCode={order.shipment.trackingCode} />
              )}
            </div>
          </div>
          <div className="mb-4 h-fit w-full rounded-md border-2 border-neutral-200 p-3.5 text-sm xl:p-5">
            <h2 className="mb-3 text-sm font-semibold md:text-base">
              Delivery Details
            </h2>
            <div className="space-y-1 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold sm:[&_h4]:text-nowrap">
              <div>
                <h4>Address</h4>
                <p className="text-right">
                  {order.delivery.addressLineOne},{" "}
                  {order.delivery.addressLineTwo}
                </p>
              </div>
              <div>
                <h4>Delivered at</h4>
                <p className="text-right">
                  {!order.delivery.date
                    ? "--"
                    : `${order.delivery.date}, ${order.delivery.time}`}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-5 top-5 h-fit w-full rounded-md border-2 border-neutral-200 p-3.5 font-semibold xl:p-5">
          <div className="relative flex w-full flex-col">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <h2 className="text-sm font-semibold md:text-base">Items</h2>
                <span className="flex size-5 items-center justify-center rounded-full bg-neutral-200 text-[11px]/[11px] font-semibold text-neutral-600">
                  {order.items.reduce(
                    (accumulator, item) =>
                      Number(item.selectedQuantity) + accumulator,
                    0,
                  )}
                </span>
              </div>
              <ul className="mb-4 space-y-3">
                {order.items.map((item, itemIndex) => {
                  return (
                    <li
                      key={item + itemIndex}
                      className="flex w-full items-stretch justify-between gap-x-2.5"
                    >
                      <TransitionLink
                        href={`/product/${item.title.split(" ").join("-").toLowerCase()}`}
                        className="relative h-14 overflow-hidden rounded-md bg-[#F0F0F0] max-sm:w-12 sm:aspect-square sm:h-16"
                      >
                        <Image
                          className="h-full w-full object-contain"
                          src={item.imgURL}
                          alt={item.title}
                          fill
                          sizes="15vh"
                        />
                      </TransitionLink>
                      <div className="grow text-xs text-neutral-400 lg:text-sm">
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex justify-between gap-x-2 sm:gap-x-5">
                            <div>
                              <TransitionLink
                                href={`/product/${item.title.split(" ").join("-").toLowerCase()}`}
                                className="underline-offset-1 hover:underline"
                              >
                                <h4 className="line-clamp-1 text-neutral-600">
                                  {item.title}
                                </h4>
                              </TransitionLink>
                              <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                                <h5>Size:</h5>
                                <span>{item.selectedSize}</span>
                              </div>
                              <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                                <h5>Color:</h5>
                                <div className="flex items-center gap-x-1">
                                  <div
                                    style={{
                                      backgroundColor:
                                        item.selectedColor.colorCode,
                                    }}
                                    className="size-3.5 rounded-full"
                                  />
                                  {item.selectedColor.color}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex h-fit shrink-0 gap-x-2">
                                <p className="text-nowrap text-neutral-600">
                                  ৳ {item.price.toLocaleString()}
                                </p>
                              </div>
                              <p className="text-right text-xs text-neutral-600 lg:text-sm">
                                x {item.selectedQuantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="space-y-4 bg-white text-[13px] max-lg:order-last md:text-sm">
              <hr className="h-0.5 w-full bg-neutral-100" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h5 className="text-neutral-400">Subtotal</h5>
                  <span>৳ {calculateSubtotal().toLocaleString()}</span>
                </div>
                {!!order.promo && (
                  <div className="flex justify-between">
                    <h5 className="text-neutral-400">
                      Discount ({order.promo.code})
                    </h5>
                    <span className="text-right">
                      - ৳{" "}
                      {`${calculateDiscount().toLocaleString()}${
                        order.promo.discountType === "percentage"
                          ? ` (${order.promo.discountAmount.toLocaleString()}%)`
                          : ""
                      }`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <h5 className="text-neutral-400">Shipping Charge</h5>
                  <span>৳ {calculateShippingCharge()}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-700 md:text-base">
                  <h5>Payment Amount</h5>
                  <span>৳ {calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              <TransitionLink
                href={order.invoiceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#d4ffce] py-3 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
              >
                Download Invoice
                <LuDownload size={14} />
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
