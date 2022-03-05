export const categories = [
  {
    name: 'cars',
    image: 'https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg',
  },
  {
    name: 'wallpaper',
    image: 'https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg',
  },
  {
    name: 'photo',
    image: 'https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg',
  },
  {
    name: 'food',
    image: 'https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg',
  },
  {
    name: 'nature',
    image: 'https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg',
  },
  {
    name: 'art',
    image: 'https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg',
  },
  {
    name: 'travel',
    image: 'https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg',
  },
  {
    name: 'quotes',
    image: 'https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg',
  },
  {
    name: 'animals',
    image: 'https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg',
  },
  {
    name: 'other',
    image: 'https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg',
  },
];

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
  image{
    asset->{
      url
    }
  },
      _id,
      title,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      likes[]{
        _key,
        likedBy->{
          _id,
          userName,
          image
        }
      },
      save[]{
        _key,
        postedBy->{
          _id,
        },
      },
    } `;

export const collectionFeedQuery = `*[_type == "pinCollection"] | order(_createdAt desc) {
      _id,
      title,
      postedBy->{
        _id,
        userName,
        image
      },
      pins[]{
        _key,
        item->{
          _id,
          title,
          image{
            asset->{
              url
            }
          }
        }
      },
    } `;
  
export const categoryQuery = `*[_type == "category"] | order(_createdAt desc) {
  _id,
  title,
  "pinCount":count(pins),
  pins[0..3]{
    _key,
    item->{
      _id,
      title,
      image{
        asset->{
          url
        }
      },
      postedBy->{
        _id,
        userName,
        image
      },
      likes[]{
        _key,
        likedBy->{
          _id,
          userName,
          image
        }
      },
      save[]{
        _key,
        postedBy->{
          _id,
        },
      },
    }
  },
} `;

export const availableCategories = `*[_type == "category"]{
  _id,
  title,
} `;

export const collectionDetailQuery = (collectionId) => {
  const query = `*[_type == "pinCollection" && _id == '${collectionId}']{
    _id,
      title,
      about,
      postedBy->{
        _id,
        userName,
        image
      },
      pins[]{
        _key,
        item->{
          _id,
          title,
          destination,
          save[]{
            _key,
            postedBy->{
              _id,
            },
          },
          likes[]{
            _key,
            likedBy->{
              _id,
              userName,
              image
            }
          },
          postedBy->{
            _id,
            userName,
            image
          },
          image{
            asset->{
              url
            }
          }
        }
      },
      likes[]{
        _key,
        likedBy->{
          _id,
          userName,
          image
        }
      },
      save[]{
        _key,
        postedBy->{
          _id,
        },
      },
  }`;
  return query;
};

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    _id,
    about,
    category,
    postedBy->{
      _id,
      followers[]{
        followedBy->{
          _id
        }
      }
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

export const sharePinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    _id,
    image{
      asset->{
        url
      }
    },
    title,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    likes[]{
      _key,
      likedBy->{
        _id,
        userName,
        image
      }
    },
    save[]{
      _key,
      postedBy->{
        _id,
      },
    },
  }`;
  return query;
};

export const categoryDetailQuery = (categoryId) => {
  const query = `*[_type == "category" && _id == '${categoryId}']{
    _id,
  title,
  pins[]{
    _key,
    item->{
      _id,
      title,
      image{
        asset->{
          url
        }
      },
      postedBy->{
        _id,
        userName,
        image
      },
      likes[]{
        _key,
        likedBy->{
          _id,
          userName,
          image
        }
      },
      save[]{
        _key,
        postedBy->{
          _id,
        },
      },
    }
  },
  }`;
  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    title,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    likes[]{
      _key,
      likedBy->{
        _id,
        userName,
        image
      }
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
    image{
      asset->{
        url
      }
    },
        _id,
        title,
        destination,
        postedBy->{
          _id,
          userName,
          image
        },
        likes[]{
          _key,
          likedBy->{
            _id,
            userName,
            image
          }
        },
        save[]{
          _key,
          postedBy->{
            _id,
          },
        },
          }`;
  return query;
};

export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`;
  return query;
};

export const userCollectionQuery = (userId) => {
  const query = `*[ _type == 'pinCollection' && userId == '${userId}'] | order(_createdAt desc){
    _id,
    title,
    pins[]{
      _key,
      item->{
        _id,
        title
      }
    }
  }`;
  return query;
}

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};