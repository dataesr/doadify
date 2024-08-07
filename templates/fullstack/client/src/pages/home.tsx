import { Text, Title, Container } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";

async function getHello() {
  return fetch("/api/hello").then((response) => {
    if (response.ok) return response.json();
    return "Oops... La requète à l'API n'a pas fonctionné";
  });
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: getHello,
  });
  return (
    <Container className="fr-my-15w">
      <Title as="h1">Doadify</Title>
      <Text>{isLoading ? "Chargement..." : data?.hello}</Text>
    </Container>
  );
}
