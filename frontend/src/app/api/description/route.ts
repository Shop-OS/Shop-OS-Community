import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: NextRequest) => {
  try {
    const request_body = await req.json();
    const authorization_header = req.headers.get('authorization');
    const { messages, prompt = "", imageUrl } = request_body;

    const authentication = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/api/auth/verify-token`, {}, { headers: { Authorization: authorization_header } });
    
    if (authentication.status !== 200) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!authentication.data.email || authentication.data.email.trim() === '') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const thread = messages ? [...messages, {
      "role": "user",
      "content": [{
        "type": "text",
        "text": prompt + "Context: You're an award-winning advertising copywriter renowned for crafting captivating and highly-engaging product descriptions. Your client is launching an exciting new product (image attached) and has tasked you with creating advertisements that will have customers eagerly lining up to purchase it. \n Instruction: Write three advertisements for the product: \n 1. Creative Ad: A highly captivating ad of 50-100 words that showcases the product's unique features and benefits in an exciting, irresistible manner. Focus on generating buzz and making the product sound as innovative and appealing as possible. 2. Balanced Ad: Craft a 50-100 word ad that blends captivating language with informative details. Aim to engage the reader while effectively communicating key product information. 3. Precise Ad: Develop a 50-100 word factual description of the product specifications and features. Avoid excessive adjectives and focus on providing accurate, informative details. \n\n Output Indicator: Respond with all three requested advertisement variations, clearly labeled, in JSON format. \n\n Constraints: Keep each ad concise yet impactful for its intended style, using everyday language suited for a broad audience. Avoid industry jargon. Don't add the example in the output. Example: { 'Creative': 'Transform your mornings with the revolutionary AeroPress Coffee Maker - a compact, portable wonder that delivers barista-quality brew in under a minute! Crafted for coffee lovers on the move, its innovative design ensures a smooth, full-bodied flavor every time. Elevate your coffee experience today!',   'Balanced': 'Indulge in barista-quality coffee anytime, anywhere with the AeroPress Coffee Maker. This compact marvel brews a smooth, flavorful cup in under a minute, thanks to its innovative design. Perfect for travelers and coffee enthusiasts seeking convenience without compromising on taste.',   'Precise': 'The AeroPress Coffee Maker is a compact, lightweight device made of durable plastic. Featuring a fine mesh micro-filter and plunger, it includes 350 paper filters. Brews 1-3 cups per press in about a minute. Dimensions: 4.8 x 4.5 x 11.8 inches. Weight: 15.9 ounces. BPA-free and includes compostable filters.'}"
      }]
    }] : [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": prompt + "Context: You're an award-winning advertising copywriter renowned for crafting captivating and highly-engaging product descriptions. Your client is launching an exciting new product (image attached) and has tasked you with creating advertisements that will have customers eagerly lining up to purchase it. \n Instruction: Write three advertisements for the product: \n 1. Creative Ad: A highly captivating ad of 50-100 words that showcases the product's unique features and benefits in an exciting, irresistible manner. Focus on generating buzz and making the product sound as innovative and appealing as possible. 2. Balanced Ad: Craft a 50-100 word ad that blends captivating language with informative details. Aim to engage the reader while effectively communicating key product information. 3. Precise Ad: Develop a 50-100 word factual description of the product specifications and features. Avoid excessive adjectives and focus on providing accurate, informative details. \n\n Output Indicator: Respond with all three requested advertisement variations, clearly labeled, in JSON format. \n\n Constraints: Keep each ad concise yet impactful for its intended style, using everyday language suited for a broad audience. Avoid industry jargon. Don't add the example in the output. Example: { 'Creative': 'Transform your mornings with the revolutionary AeroPress Coffee Maker - a compact, portable wonder that delivers barista-quality brew in under a minute! Crafted for coffee lovers on the move, its innovative design ensures a smooth, full-bodied flavor every time. Elevate your coffee experience today!',   'Balanced': 'Indulge in barista-quality coffee anytime, anywhere with the AeroPress Coffee Maker. This compact marvel brews a smooth, flavorful cup in under a minute, thanks to its innovative design. Perfect for travelers and coffee enthusiasts seeking convenience without compromising on taste.',   'Precise': 'The AeroPress Coffee Maker is a compact, lightweight device made of durable plastic. Featuring a fine mesh micro-filter and plunger, it includes 350 paper filters. Brews 1-3 cups per press in about a minute. Dimensions: 4.8 x 4.5 x 11.8 inches. Weight: 15.9 ounces. BPA-free and includes compostable filters.'}"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": imageUrl
            }
          }
        ]
      }
    ];

    const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4-turbo",
      response_format: {
        type: "json_object"
      },
      "messages": thread
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const data: any = apiResponse.data;
    const choice = data.choices[0].message;

    return NextResponse.json({
      conv: [...thread, choice],
      description: choice.content
    });
  } catch (error) {
    // console.log(JSON.stringify((error as any).data.error))
    return NextResponse.json({ message: 'Failed to fetch description', error: error });
  }
}
