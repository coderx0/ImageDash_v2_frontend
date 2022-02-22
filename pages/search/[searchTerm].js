import { client } from "../../lib/sanityClient";
import { searchQuery } from "../../lib/Data";
import Feed from "../../components/Feed";
import Layout from "../../components/Layout";

const SearchTerm = ({searchedPins}) => {
    
    return (
      <Layout>
            <Feed pins={searchedPins} />
        </Layout>
  )
}

export default SearchTerm;

export async function getServerSideProps(context) {
    const { searchTerm } = context.params;
    const query = searchQuery(searchTerm);

    const data = await client.fetch(query);
    return {
        props: {
            searchedPins:data
        }
    }
}