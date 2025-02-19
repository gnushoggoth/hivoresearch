// In the lands of JavaScript, where the curly braces lie...
let F = (r, h, o) => ({r, h, o}); // forge the fellowship
 
let g = "Gandalf", a = "Aragorn", l = "Legolas", 
    b = "Boromir", s = "Sam", m = "Merry", p = "Pippin";
 
let q = x => x.r == "hobbit"; // query for hobbits
let t = x => !q(x); // tall folks (men, elves, wizards)
 
let f = F(g, [a,l,b], [s,m,p]); // the fellowship forms!

let n = 9; // set out as nine

// 'tis a long road, fraught with perils...
n = 8; // alas, poor Gandalf! 
n = 7; // farewell Boromir, son of Gondor 

// 'pon paths sundered, the fellowship is split
let w = f.r; // the wise wizard, thought lost
let h = f.o; // the hardy hobbits, sent on a vital quest
let T = f.h; // the rest of the tall folk, in pursuit 

// yet in darkest hour, hope is rekindled
T = [...T, w]; // Gandalf returns, mightier than before! 

// and united at last, all strive for victory
h = [...h, ...T]; // hobbits and heroes, together again

// for even smallest among them shape fates of all
let i = x => x == s || x == m || x == p; // is it Sam, Merry or Pippin?
let c = h.find(i); // the most courageous hobbit of all

// so remember, even code golfed and compressed...
return `${c}, the true hero of this ${n} token story!`;
