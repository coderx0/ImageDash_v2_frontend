export const categories = [
  {
    name: 'nature',
    categoryId:'29dbb1fb-b834-4910-858d-a60a54751bfe',
    image: 'https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg',
  },
  {
    name: 'art',
    categoryId:'d6b406e9-e5b9-47ef-90ad-7fe4fe43816a',
    image: 'https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg',
  },
  {
    name: 'animals',
    categoryId:'55a3ada7-0030-4a75-8d34-91dd1b468346',
    image: 'https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg',
  },
  {
    name: 'Games',
    categoryId: '62ca81b6-b236-4802-aa3c-0ca470e04504',
    image:'https://i.pinimg.com/564x/39/38/e5/3938e57ede81e22977c3a2e406edb28e.jpg'
  }
];

export const feedQuery = (start,end) => {
  const query = `*[_type == "pin"] | order(_createdAt desc) {
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
        save[]{
          _key,
          postedBy->{
            _id,
          },
        },
      }[${start}...${end}]`;
  return query;
};
    
export const collectionFeedQuery = `*[_type == "pinCollection" && count(pins)>2 && !isPrivate] | order(_createdAt desc) {
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
  
export const categoryQuery = (start, end) => {
  const query = `*[_type == "category"] {
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
  }[${start}...${end}]`;
  return query;
};

export const availableCategories = `*[_type == "category"]{
  _id,
  title,
} `;

export const collectionDetailQuery = (collectionId,requesterId) => {
  const query = `*[_type == "pinCollection" && _id == '${collectionId}' && (!isPrivate || (isPrivate && userId == '${requesterId}'))]{
    _id,
      title,
      about,
      isPrivate,
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
      followers[]{
        followedBy->{
          _id
        }
      },
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
  about,
  bannerImage{
    asset->{
      url
    }
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
  }[0...4]`;
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
    isPrivate,
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
  const query = `*[ _type == 'user' && _id == '${userId}']{
    'pins':uploads[].item->{
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
        save[]{
          postedBy->{
            _id,
            userName,
            image
          },
        },
    }
  }`;
  return query;
};


export const userLikedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in likes[].userId ] | order(_createdAt desc) {
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
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};