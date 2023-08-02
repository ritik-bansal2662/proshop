import React from "react";

const Section = ({ children }) => {
  return (
    <section
      style={{
        margin: "5px auto"
      }}
    >
      {children}
    </section>
  );
};

export default Section;
