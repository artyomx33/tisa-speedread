'use client'

import { useState, useCallback } from 'react'
import type { Topic } from '@/schemas/user'

const sampleTexts: Record<Topic, string[]> = {
  dinosaurs: [
    `The mighty Tyrannosaurus Rex was one of the largest meat-eating dinosaurs ever. It lived about sixty-five million years ago during the late Cretaceous period. With teeth as long as bananas, it could crush bones with a single bite easily. Scientists have found fossils all over North America showing where they roamed. Baby T-Rex dinosaurs were covered in soft fluffy feathers when they hatched. They grew incredibly fast, gaining about five pounds every single day. Adult T-Rex could run as fast as twenty-five miles per hour despite their size. Their tiny arms were actually very strong and could lift heavy weights. Some scientists think T-Rex hunted in packs like wolves do today. The dinosaurs went extinct when a giant asteroid hit Earth millions of years.`,
    `Velociraptors were much smaller than movies show us in the theaters. They were only about the size of a turkey but very dangerous indeed. These clever hunters had a large curved claw on each foot for attack. They probably hunted in groups to take down much bigger prey than them. Fossils found in Mongolia show they had feathers covering their whole body. Their brains were quite large compared to other dinosaurs of their time. Scientists believe they were some of the smartest dinosaurs that ever lived. They could run very fast and jump high to catch their food easily. Velociraptors lived about seventy million years ago in Asia and other places. Some scientists think modern birds are related to these ancient feathered hunters.`,
  ],
  space: [
    `Our solar system has eight planets orbiting around the bright yellow Sun. Mercury is the closest planet and it gets incredibly hot during the day. Venus is covered in thick clouds that trap heat making it even hotter. Earth is the only planet we know of that has life living on it. Mars is called the red planet because of its rusty colored dusty surface. Jupiter is so big that all other planets could fit inside of it. Saturn has beautiful rings made of ice and rocks floating around it gracefully. Uranus and Neptune are ice giants far away in the cold outer space. Beyond Neptune lies Pluto which used to be called our ninth planet officially. Astronauts dream of one day visiting Mars and maybe living there someday soon.`,
    `Stars are giant balls of hot glowing gas floating far out in space. Our Sun is actually a medium-sized star compared to many others out there. Some stars are so big they could swallow our entire solar system whole. When stars run out of fuel they can explode in a giant blast called supernova. The closest star to us besides the Sun is over four light years away. That means light takes four whole years to travel from there to us. Astronomers use powerful telescopes to study stars millions of miles away from Earth. Some stars have planets orbiting around them just like our solar system does. Scientists are searching for planets that might have water and maybe even life. The night sky has billions of stars that we can see twinkling above.`,
  ],
  robots: [
    `Robots are amazing machines that can do many tasks to help humans. Some robots work in factories building cars and other products very quickly and precisely. Other robots explore dangerous places where humans cannot safely go at all. Scientists have sent robots to Mars to study the red planet surface up close. These Mars robots take pictures and collect samples of rocks and soil there. Medical robots help doctors perform surgery with incredible accuracy and tiny movements. Some robots can walk on two legs just like humans do every day. Engineers are working on robots that can think and learn new things themselves. Robot vacuums clean floors while you relax and do other important things. In the future robots might become our helpers teachers and even good friends.`,
  ],
  animals: [
    `Elephants are the largest land animals on Earth and they are very intelligent. They live in family groups led by the oldest female called the matriarch. Baby elephants stay with their mothers for many years learning important survival skills. Elephants use their long trunks to drink water eat food and communicate feelings. They can remember places and other elephants for their entire long lives amazingly. African elephants have larger ears than their Asian elephant cousins do today. Elephants spend up to sixteen hours every single day just eating plants leaves. They are very social animals and show emotions like happiness sadness and grief. Conservation efforts help protect elephants from hunters who want their valuable ivory tusks. These gentle giants play an important role in keeping their ecosystems healthy overall.`,
  ],
  superheroes: [
    `Superheroes use their amazing powers to help people and fight against villains. Some heroes can fly through the sky faster than any airplane ever could. Others have super strength that lets them lift cars and even huge buildings. Many superheroes wear colorful costumes and masks to hide their secret identities. They often work alone but sometimes team up to defeat powerful evil enemies. Spider-Man swings between tall buildings using his special sticky web shooters gracefully. Batman uses cool gadgets and his brilliant detective mind to solve crimes. Wonder Woman is an Amazon warrior princess with incredible strength and a magic lasso. The Flash can run so fast that he becomes invisible to regular human eyes. Superheroes teach us that anyone can make a difference by helping others.`,
  ],
  ocean: [
    `The ocean covers more than seventy percent of our entire planet Earth surface. It is home to millions of different species from tiny plankton to huge whales. The deepest part of the ocean is called the Mariana Trench going down miles. Strange creatures live in the deep ocean where no sunlight can reach them. Some fish down there make their own light to see in the total darkness. Coral reefs are like underwater cities full of colorful fish and sea creatures. Dolphins are very smart mammals that communicate using clicks and whistles underwater. Sea turtles travel thousands of miles across oceans to lay their eggs on beaches. Sharks have been swimming in the oceans for over four hundred million years. Protecting our oceans is important because they give us oxygen and food to survive.`,
  ],
  sports: [
    `Soccer is the most popular sport in the world with billions of fans. Players kick a round ball trying to score goals against the opposing team. The World Cup is the biggest soccer tournament bringing together countries from everywhere. Basketball was invented in America and is now played all around the globe today. Players dribble bounce and shoot the ball through a hoop ten feet high. Baseball is called America's favorite pastime and has been played for over a century. Tennis players hit a small ball back and forth over a net court. Swimming is great exercise and Olympic swimmers can move incredibly fast through water. Running is one of the oldest sports and anyone can do it almost anywhere. Playing sports teaches teamwork discipline and how to handle both winning and losing.`,
  ],
  magic: [
    `Wizards and witches have been part of stories for thousands of years. They cast spells using magic wands staffs or just their hands and words. Some magic users can transform objects into completely different things instantly like miracles. Potions are special drinks that can give people amazing powers or heal wounds. Magic schools in stories teach young wizards how to control their special abilities. Dragons are magical creatures that breathe fire and guard treasure in their caves. Unicorns are beautiful horses with a single magical horn on their forehead glowing. Fairies are tiny magical beings with delicate wings who grant wishes sometimes kindly. Merlin was a famous wizard who helped King Arthur become a great ruler. Magic reminds us that imagination can create wonderful worlds full of endless possibilities.`,
  ],
  nature: [
    `Forests are home to countless animals plants and insects living together in harmony. Trees produce oxygen that all living creatures including humans need to breathe every day. Rainforests near the equator have more species than any other place on Earth. Mountains are formed when huge pieces of Earth's crust push against each other slowly. Rivers carry water from mountains down to the oceans crossing through many landscapes. Deserts may look empty but many special plants and animals survive there somehow. Seasons change because Earth tilts as it travels around the Sun each year. Birds migrate thousands of miles to find food and warm weather to survive. Bees are very important because they help flowers grow into fruits and vegetables. Spending time in nature helps people feel calm happy and connected to Earth.`,
  ],
  adventures: [
    `Explorers throughout history have traveled to discover new lands and hidden treasures. Some adventurers climb the highest mountains in the world facing extreme cold and danger. Others dive deep into the ocean to explore shipwrecks and underwater caves carefully. The Amazon rainforest is one of the last great frontiers for modern day explorers. Ancient maps sometimes show mysterious places that adventurers dream of finding and exploring. Treasure hunters search for gold coins jewels and artifacts from long ago times. Survival skills help adventurers find food water and shelter in the wild outdoors. Compasses and maps help explorers navigate through unfamiliar and dangerous territories safely today. Many adventures start with curiosity and the courage to try something completely new. Every person can have adventures by exploring their own neighborhood with fresh curious eyes.`,
  ],
  science: [
    `Scientists ask questions about the world and then do experiments to find answers. Chemistry is the study of what things are made of and how they change. Mixing baking soda and vinegar creates a fun bubbly chemical reaction you can try. Physics helps us understand how things move and why objects fall down not up. Biologists study living things from tiny bacteria to giant blue whales in oceans. The scientific method helps researchers test their ideas in a fair organized way. Microscopes let scientists see tiny things that are invisible to our naked eyes. Space telescopes take amazing pictures of galaxies billions of light years away from us. Scientists work together sharing discoveries to help solve big problems facing humanity. Anyone can be a scientist by staying curious and asking how things really work.`,
  ],
  minecraft: [
    `Minecraft is a game where you can build anything you imagine using blocks. Players gather resources like wood stone and iron to craft tools and buildings. Survival mode challenges players to find food and shelter before nighttime comes around. Creepers are green monsters that explode if they get too close to your character. The Nether is a dangerous dimension full of lava and scary creatures to fight. Diamonds are rare and valuable used to make the strongest tools and armor available. Villagers trade items with players and live in houses throughout the game world. Redstone is like electricity that lets you build amazing machines and contraptions working. Players can tame wolves cats and horses to be their helpful companions everywhere. Minecraft teaches creativity problem solving and planning skills while having lots of fun.`,
  ],
  pokemon: [
    `Pokemon trainers travel the world catching and training amazing magical creatures with powers. Each Pokemon has special abilities and types like fire water grass or electric. Pikachu is a yellow electric mouse and one of the most famous Pokemon ever. Trainers battle their Pokemon against others to become stronger and earn gym badges. Evolution transforms Pokemon into more powerful forms when they gain enough experience fighting. Legendary Pokemon are rare and powerful creatures that appear in ancient stories told. Pokeballs are special devices used to catch and store Pokemon for your adventures. Friendship between trainers and their Pokemon makes both of them stronger over time. Pokemon Centers heal tired Pokemon so they can continue battling and exploring more. The dream of every trainer is to catch them all and become a champion.`,
  ],
  cars: [
    `Cars have changed the way people travel making it faster and more convenient today. The first cars were invented over a hundred years ago and looked very different. Race cars can go over two hundred miles per hour on special racing tracks. Electric cars use batteries instead of gasoline and are better for the environment. Formula One races feature the fastest and most advanced cars in the whole world. Engineers design cars to be safe comfortable and fun to drive every single day. Some cars can now drive themselves using computers and special sensors to navigate. Classic cars from the past are collected and restored by people who love them. The engine is the heart of a car turning fuel into power and motion. Future cars might fly or travel on roads without any drivers needed at all.`,
  ],
  music: [
    `Music is a universal language that people all around the world understand and enjoy. Instruments like guitars pianos and drums create different sounds that blend together beautifully. Singing is one of the oldest forms of music and everyone has their own voice. Classical music was composed by famous musicians like Mozart and Beethoven centuries ago. Rock and roll became popular in the nineteen fifties and changed music forever then. Hip hop started in New York City and spread to become a global phenomenon. Learning to play an instrument takes practice but is very rewarding and fun eventually. Music can make people feel happy sad excited or calm depending on the song. Concerts bring thousands of fans together to experience live music and share the joy. Creating your own music is a wonderful way to express feelings and tell stories.`,
  ],
}

export function useTextGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateText = useCallback(async (topic: Topic, _age?: number): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate a small delay like an API call would have
      await new Promise(resolve => setTimeout(resolve, 300))

      const texts = sampleTexts[topic] || sampleTexts.adventures
      const randomText = texts[Math.floor(Math.random() * texts.length)]

      return randomText
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate text'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateForTopics = useCallback(async (topics: Topic[], age?: number): Promise<string> => {
    if (topics.length === 0) {
      return generateText('adventures', age)
    }
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    return generateText(randomTopic, age)
  }, [generateText])

  return {
    generateText,
    generateForTopics,
    isLoading,
    error,
  }
}
