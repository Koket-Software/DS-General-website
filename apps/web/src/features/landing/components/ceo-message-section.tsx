import imgSignature from "../../../../assets/fc0a07d840c76d3dcf154dd65bcaf3aef1c0d793.png";

export function CEOMessageSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <div className="flex flex-col lg:flex-row gap-10 items-center">
        {/* Decorative pattern background */}
        <div className=" w-100 h-109.25 relative shrink-0 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 437" fill="none">
            {/* Generate a grid of star/cross shapes */}
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => {
                const cx = 54.5 + col * 109;
                const cy = 54.5 + row * 109;
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={cx}
                    cy={cy}
                    r="54.5"
                    fill="var(--primary)"
                    fillOpacity="0.05"
                  />
                );
              }),
            )}
          </svg>
        </div>

        {/* CEO message content */}
        <div className="flex flex-col gap-12 flex-1">
          <div className="flex flex-col gap-1">
            <h3 className="font-sans font-medium text-foreground text-[24px]">
              CEO Message
            </h3>
            <p className="font-sans font-normal text-muted-foreground text-[16px] capitalize">
              Welcome to DS General PLC
            </p>
          </div>

          <div className="font-sans font-normal text-muted-foreground text-[16px] leading-normal flex flex-col gap-4">
            <p>
              When we established DS General PLC, we did so with a singular
              vision: to be a reliable engine for Ethiopia's growth. In a
              rapidly evolving market, we recognized that true development
              requires two things - access to the best resources and the
              expertise to build with them.
            </p>
            <p>
              For too long, businesses and developers in Ethiopia have had to
              choose between speed and quality. At DS General, we believe you
              deserve both.
            </p>
          </div>

          {/* Signature */}
          <div className="flex flex-col items-center gap-2 self-start">
            <div className="h-17 w-46.25 relative">
              <img
                src={imgSignature}
                alt="CEO Signature"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="font-sans font-semibold text-foreground text-[16px] text-center">
                DEJENE LETA
              </p>
              <p className="font-sans font-light text-muted-foreground text-[16px]">
                General Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
