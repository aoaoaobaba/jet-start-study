export const data = new webix.DataCollection({
  data: Array.from({ length: 120 }, (_, i) => {
    const base = [
      {
        title: "The Shawshank Redemption",
        year: 1994,
        votes: 678790,
        rating: 9.2,
      },
      { title: "The Godfather", year: 1972, votes: 511495, rating: 9.2 },
      {
        title: "The Godfather: Part II",
        year: 1974,
        votes: 319352,
        rating: 9.0,
      },
      {
        title: "The Good, the Bad and the Ugly",
        year: 1966,
        votes: 213030,
        rating: 8.9,
      },
      { title: "My Fair Lady", year: 1964, votes: 533848, rating: 8.9 },
      { title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9 },
    ];
    const b = base[i % base.length];
    return {
      id: i + 1,
      title: `${b.title} ${Math.floor(i / base.length) + 1}`,
      year: b.year,
      votes: b.votes + i * 10,
      rating: b.rating,
      rank: i + 1,
    };
  }),
});
