import { client } from "../../lib/sanityClient";
import { searchQuery } from "../../lib/Data";
import Feed from "../../components/Feed";
import Layout from "../../components/Layout";
import Lottie from "lottie-react";
import notFound from "../../public/notFound.json";

const SearchTerm = ({searchedPins,searchTerm}) => {
    
    return (
        <>
            <div className="text-4xl font-bold px-5 pt-2">
                {searchTerm}
            </div>
            {searchedPins.length > 0 ? 
                <Layout>
            <Feed pins={searchedPins} />
                </Layout> :
                <div className="text-center text-xl my-8 flex flex-col">
                    <h1>No results found.</h1>
        
                    <Lottie
                        className="h-[70vh]"
                        animationData={notFound}
                        loop />
                    
                <div>
                        
                </div>
                </div>}
     </>
  )
}

export default SearchTerm;

export async function getServerSideProps(context) {
    const { searchTerm } = context.params;
    const query = searchQuery(searchTerm);

    const data = await client.fetch(query);
    return {
        props: {
            searchedPins: data,
            searchTerm
        }
    }
}