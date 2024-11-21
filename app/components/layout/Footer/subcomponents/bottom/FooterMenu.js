import CompanyInfo from "./subsubcomponents/CompanyInfo";
import CompanyLinks from "./subsubcomponents/ComanyLinks";
import Importantlinks from "./subsubcomponents/ImportantLinks";
import PaymentMethodPartners from "./subsubcomponents/PaymentMethodPartners";

export default function FooterMenu() {
  return (
    <div className="grid grid-cols-2 justify-between pb-8 pt-12 max-lg:gap-12 sm:grid-cols-[auto,auto,auto] lg:grid-cols-[auto,auto,auto,auto]">
      <CompanyInfo />
      <CompanyLinks />
      <Importantlinks />
      <PaymentMethodPartners />
    </div>
  );
}
