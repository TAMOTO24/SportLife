import { useContext, useEffect, useState } from "react";

const loading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
};

export default loading;