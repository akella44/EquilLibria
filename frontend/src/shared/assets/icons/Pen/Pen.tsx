import { FC } from "react";
import { IconWrapper } from "../IconWrapper";

export const Pen: FC = ({ padding }) => {
  return (
    <IconWrapper padding={padding}>
      <svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.3719 1.73024C15.2866 0.81552 16.5272 0.301636 17.8208 0.301636C19.1144 0.301636 20.3551 0.81552 21.2698 1.73024C22.1845 2.64496 22.6984 3.88559 22.6984 5.1792C22.6984 6.47281 22.1845 7.71344 21.2698 8.62816L11.3885 18.5094C10.824 19.074 10.4927 19.4052 10.1219 19.6938C9.68577 20.0354 9.21702 20.3254 8.71563 20.5636C8.29271 20.7646 7.84688 20.9136 7.09063 21.1657L3.61979 22.3219L2.78438 22.6011C2.45212 22.712 2.09552 22.7282 1.75459 22.6478C1.41365 22.5674 1.10186 22.3936 0.854167 22.1459C0.606476 21.8982 0.432685 21.5864 0.352281 21.2454C0.271878 20.9045 0.288042 20.5479 0.398961 20.2157L1.83438 15.9104C2.08646 15.1532 2.23542 14.7073 2.43646 14.2834C2.67535 13.7834 2.96528 13.3146 3.30625 12.8771C3.59375 12.5084 3.92604 12.1761 4.49063 11.6115L14.3719 1.73024ZM3.58334 20.6886L6.54271 19.7011C7.36667 19.4261 7.71667 19.3084 8.04271 19.1532C8.43993 18.9629 8.8125 18.7327 9.16042 18.4625C9.44479 18.2396 9.70729 17.9802 10.3219 17.3657L18.2073 9.48024C17.1262 9.09714 16.1448 8.47634 15.3354 7.66357C14.5234 6.85402 13.9033 5.87264 13.5208 4.7917L5.63542 12.6771C5.02084 13.2907 4.76042 13.5521 4.53854 13.8375C4.26771 14.1848 4.0375 14.5573 3.84792 14.9552C3.69271 15.2813 3.575 15.6313 3.3 16.4552L2.3125 19.4167L3.58334 20.6886ZM14.7865 3.52399C14.8229 3.70628 14.8823 3.9542 14.9833 4.24274C15.2881 5.11467 15.7867 5.90607 16.4417 6.55732C17.0926 7.21216 17.8837 7.71078 18.7552 8.01566C19.0448 8.1167 19.2927 8.17607 19.475 8.21253L20.1646 7.52295C20.7826 6.9006 21.1287 6.05867 21.1272 5.1816C21.1257 4.30453 20.7766 3.46382 20.1564 2.84364C19.5362 2.22345 18.6955 1.87436 17.8184 1.87282C16.9414 1.87129 16.0994 2.21744 15.4771 2.83545L14.7865 3.52399Z"
          fill="#B9B5CB"
        />
      </svg>
    </IconWrapper>
  );
};