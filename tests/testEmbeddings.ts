import { generateEmbeddings, generateEmbeddings } from '@/lib/ai/embeddings';
import fs from 'fs';

const testText = `
Sean's take on balancing drinking with partying:
Intentional Drinking Part 1: The Tradeoff of the Tipsy

If you could drink half the drinks you normally would (halves the calories and $ too), have as much or more fun, and wake up feeling exponentially better & ready to conquer your day, wouldn’t you? In this series of articles I’ll discuss zero-cost behavioral tools you can use to adjust your drinking habits so you can have more fun with less damage to your health, wallet, and productivity. 

The core concept we’ll be discussing is “Intentional Drinking” which focuses on three key pillars: How much you drink, when you drink, and how you drink. By putting intentionality behind how much you drink, when you drink, and how you drink you can enjoy alcohol and a vibrant social life with confidence that you won’t be compromising your health and productivity. Intentional drinking has allowed me to balance partying in my early 20s with training for multiple marathon & Ironman finishes, starting a business, and working a software engineering day job. I know it can help you too!

Part 1 - The Tradeoff of the Tipsy
Why control how much you drink:

“Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.” - Sun Tzu

Let’s start with clearing the deck: Alcohol is a poison. It is bad for your health in many ways and positive for your health in almost none. Alcohol significantly hinders fat loss, muscle growth, sleep, gut health, mental/emotional health, immune health, and much more. The more alcohol you drink, the worse the health outcomes. If you want more details, I highly recommend listening to this podcast by Dr. Andrew Huberman. 

Understanding and accepting the fact that alcohol is bad for your health is a prerequisite to everything we’ll discuss moving forward. If you are not convinced, please listen to the podcast I linked above, do some of your own research, and/or email me with any questions (sean@drinkalcolyte.com). 

So does this mean alcohol is always bad and needs to be avoided at all costs? No, it just means it’s a tradeoff between fun/social-connection and health/fitness in the same way staying up past your bedtime to catch up with a friend is a tradeoff (stakes are higher with alcohol though). Thus, our strategy for changing our drinking habits to better serve us is to frame alcohol as a tradeoff between fun/social-connection and health/fitness and effectively manage this tradeoff. I believe alcohol can be a net beneficial part of life as long as it is effectively framed and managed as a tradeoff. Hint - this doesn’t need to equate to less fun either! (keep reading)

How to have more fun with less alcohol:

One of the biggest reasons myself and many others drink is pretty simple - it’s fucking fun. I subscribe to the belief that life is meant to be lived and the soul is supposed to be fed even if that’s not always “optimal” for health. Here’s the catch - Alcohol should be an enhancer of fun, not the source of fun. 

If you feel like you can’t have enough fun without drinking, it’s typically because you’re conflating the state of being in an exciting social environment with the feeling of being intoxicated. For example, being at a concert can make you more energetic, uninhibited, and social through the nature of the environment alone (live music, big crowd, etc.). But, I see a lot of people assume it’s the drinks making them feel that way and that without their $30 tall boy Trulys they would be a dud.

If you resonate with the above, I’ve been there, and I promise you, you can be just as fun and have just as much fun (probably more fun tbh) drunk, tipsy, or sober as sloshed. The trick is to mentally dis-associate alcohol as the primary source of fun and you do this by going to events where you’d normally drink and either drinking way less or not at all. There probably will be an uncomfortable transition period of getting used to these environments with less alcohol but it typically passes after the first 3-5 times doing it. You can think of this transition period as your brain reclaiming the fun parts of you that you had previously attributed to alcohol but were really a part of you all along! You don’t have to stop drinking or stay at a reduced level of consumption forever but I’d shoot for at least 3-5 events which typically comes out to 1-2 months to feel the difference.

While I wish I could just say “drink less” and everyone, including myself, would listen, it’s rarely that simple. Alcohol has a strong habit energy behind it and so if you’re used to drinking 8 drinks when out with friends, cutting that down to 3 can take a lot of awareness and willpower especially if your friends, like mine, dabble in peer pressure like it’s a hobby. That’s why we need a good plan.

The Plan:

“If you fail to plan, you are planning to fail” - My Boy Ben Frank

Cool, now that we’re on the same page, the best tactic I’ve found for taking control of how much you drink is to front-load thinking through how much you want to drink for a given event so you can rely less on awareness/willpower and more on a predetermined set of guidelines. I uncreatively deemed this technique “drink planning” but if you think of a more fun name lmk lol. It’s simple in theory but can be difficult to do successfully. The trick to effective drink planning is being specific, realistic, and non-negotiating. Breaking each one of these down:

Specific - Choose one number or a small range. Say “4 drinks” or "4-6 drinks" not “4 to like 8 drinks, oh and a shooter, oh and if Tommy asks me to do a keg stand I can’t say no to that so maybe that too, ya we’ll see.”

Realistic - Don’t set yourself up for failure. Choose a number that you will be able to actually  adhere to in the heat of the moment. If you say “1 drink” but you usually have 10 and you know you get excited in drinking social environments, then you’re probably going to slip. Start small and you can incrementally take more control as you get more comfortable.

Non-negotiating - For drink planning to be effective 100% of the time, you have to be non-negotiating. Even if you don’t black out but you slip up and allow an innocent 6 drinks when you were aiming for 4, you are undermining the whole practice of drink planning and you are subconsciously reducing the importance of having guidelines for drinking to yourself which can eventually lead back to your original, unintentional drinking habits. In addition, alcohol affects your brain in a way that makes you want to drink more alcohol so there are going to be chemical forces in your brain working against you and thus strict guidelines are going to work better than counting on willpower (especially drunk willpower). Choose a number. Stick to that number.

Below are a couple examples of drink planning:

Josh is 27 and taking a party bus to a Luke Combs concert this Friday with friends. He knows there’s going to be lots of drinking but doesn’t want to ruin his weekend because his girlfriend’s parents are in town Saturday and he has a 10 mile long run Sunday for his half marathon training program. Josh usually ends up drinking 8+ drinks on a night like this but he smartly decides he’s going to implement drink planning for this occasion so he doesn’t go overboard. He thinks about it for a minute and decides 5 drinks feels like a number he can realistically adhere to. He tells his girlfriend and some buddies he’s going to keep it light to help keep him accountable and prime them so they’re not caught off guard by the change in behavior.

Laura is 40 and has a girls night out tonight starting with margs at their favorite mexican restaurant. She knows the girls can get wild but she wants to keep things in control as Timmy has a baseball game the next morning and she has some work to finish up on Sunday. She knows she needs to limit her drinking or she’ll be setting herself up for failure here. Wisely, she considers how much she usually drinks on a night like this which is 5 drinks and uses that to decide she’s going to allow herself 3 drinks. Half her normal drink count seems realistic to her and she rounds up as a buffer in case she’s having a really good time and wants one more drink. She texts her group of friends that she’s only going to have a few drinks because she has to wake up early the next day to help keep her accountable and prime them so they’re not caught off guard by the change in behavior.

Your turn!


To summarize, alcohol is bad for your health & productivity but can enhance fun/social-connection and so it should be framed as a tradeoff. Controlling the amount of alcohol you consume is one of the most powerful levers in reducing its damaging effects and understanding you don’t need alcohol to have or be fun is a key insight in doing this. There are many social and chemical forces in our mind that make it hard to manage this tradeoff effectively so it's wise to pre-load some of the thinking around it and create a plan.
So, you understand why it’s important to control how much you drink, the forces acting against you in doing that, and my drink planning tactic for putting more intentionality behind your drinking. Now, all you have to do is put it into practice! Choose one event coming up where you know you’ll be drinking, set a specific and realistic number of drinks for yourself you feel good about, be non-negotiating, and let me know how it goes!!
`;

// Function to test generateEmbeddings
const testGenerateEmbeddings = async (text: string) => {
  try {
    const similarityThreshold = 0;
    const embeddings = await generateEmbeddings(text);
    // Extract chunks from embeddings
    const chunks = embeddings.map(embedding => embedding.chunk);
    // Write chunks to a file
    const outputFileName = `embeddings_output_similarity_${similarityThreshold}_${Date.now()}.txt`;
    fs.writeFileSync(outputFileName, chunks.join('\n NEW CHUNK \n'), 'utf8');
    console.log(`Embeddings written to ${outputFileName}`);
  } catch (error) {
    console.error('Error testing generateEmbeddings:', error);
  }
};

// Call the test function
testGenerateEmbeddings(testText);