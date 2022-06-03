const Content: React.FC<{ phase: number }> = ({ phase }) => {
  return (
    <div className="flex text-gray-600 w-10/12">
      <p>
        {phase === 0 && (
          <>
            Hi BDI token holder, welcome to PieDAO! We&apos;re excited to have
            you in our community. This mixer tool allows you to deposit your BDI
            tokens during the migration period. After depositing BDI you can
            swap it for our DeFi token <span className="font-bold">OR</span>{" "}
            lock DeFi for 12 months. Locking it will entitle you to receive a
            part of the BDI-DeFi KPI Options reward. Full details{" "}
            <a
              href="https://www.notion.so/piedao/BasketDAO-Acquisition-f30e72bf13754c3e844d562804ad1545"
              rel="noreferrer noopener"
              target="_blank"
              className="underline"
            >
              here
            </a>
            .
          </>
        )}
        {phase === 1 && (
          <>
            Welcome back to the mixer! At the moment We&apos;re currently mixing
            BDI into our DeFi token. Please come back on (DeFi availability
            date).
            <br />
            Once the mixing is complete you can withdraw your DeFi tokens{" "}
            <span className="font-bold">OR</span> keep them locked for 12
            months. Keeping DeFi locked will entitle you to receive a part of
            the BDI-DeFi KPI Options reward. Full details{" "}
            <a
              href="https://hemingwayapp.com/f30e72bf13754c3e844d562804ad1545"
              rel="noreferrer noopener"
              target="_blank"
              className="underline"
            >
              here
            </a>
            .
          </>
        )}
        {phase === 2 && (
          <>
            Welcome back. The mixing of BDI into DeFi is complete! Props to our
            bakers who made this possible.
            <br />
            You can now withdraw your DeFi tokens{" "}
            <span className="font-bold">OR</span> keep them locked for 12
            months. Keeping DeFi locked will entitle you to receive a part of
            the BDI-DeFi KPI Options reward. Full details{" "}
            <a
              href="https://hemingwayapp.com/f30e72bf13754c3e844d562804ad1545"
              rel="noreferrer noopener"
              target="_blank"
              className="underline"
            >
              here
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
};

export default Content;
