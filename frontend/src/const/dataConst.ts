export const backgroundTemplates = [
    // {
    //   id: 9,
    //   label: 'Beach',
    //   image: "/editorImage/beach.avif",
    //   previewImage: "/editorImage/beach.avif",
    //   lora: {
    //     name: 'better_landscapes.safetensors',
    //     strength_model: 1,
    //     strength_clip: 1,
    //   },
    //   prompt: '(sea backdrop, standing on sand, waves gently rolling in, clear sky, rocky shore foreground ,ocean background, standing at waters edge,  tranquil coastal scene, rowboats anchored near shore, wooden boats scattered along the water, gentle waves), consistent lighting, shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer, Vogue magazine style, fashion photography, sharp focus, RAW, trending on Instagram, detailed, balanced contrast, lora:ZStyle_-_Photography_Style:0.5, <lora:Cinematic Film:0.5>, lora:add-detail-xl:1.0, <lora:Perfect Hands v2:1.0>, (Proper white balance), (Shutter Speed 1/350s), blurry background, depth of field',
    //   negativePrompt: 'sunlight on face, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare, sharp background',
    //   disabled: true
    // },
    // {
    //   id: 10,
    //   label: 'City',
    //   image: "/editorImage/city.avif",
    //   previewImage: "/editorImage/city.avif",
    //   prompt: '(in middle of busy city street, sunny day, cars moving nearby), consistent lighting, shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer, Vogue magazine style, fashion photography, sharp focus, RAW, trending on Instagram, detailed, balanced contrast, <lora:ZStyle_-_Photography_Style:0.5>, <lora:Cinematic Film:0.5>, <lora:add-detail-xl:1.0>, <lora:Perfect Hands v2:1.0>, (Proper white balance), (Shutter Speed 1/350s)',
    //   negativePrompt: 'golden hour, sunlight on face, wall background, smooth skin, people in background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    // },

    {
        id: 10,
        label: 'City Night',
        image: '/editorImage/city-night.jpeg',
        previewImage: '/editorImage/city-night.jpeg',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
        prompt:
            '(standing on sidewalk, city lights backdrop, illuminated streets, cool night air, city bench at night time with bright lights from shop windows, urban elegance, neon sign reflections painting the scene in vibrant colors, urban mystique),  good shadows,',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    {
        id: 124,
        label: 'Cafe',
        image: '/editorImage/cafe.jpg',
        previewImage: '/editorImage/cafe.jpg',
        // lora: {
        //   name: 'FashionPhotographyXL.safetensors',
        //   strength_model: 0.5,
        //   strength_clip: 0.5,
        // },
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            '(standing in middle of a european street, beautiful cafe visible on the sidewalk, canopy, sunny day, modern aestheically pleasing cafe, cafe lights, sunny day),',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    {
        id: 1234,
        label: 'Mumbai Street',
        image: '/editorImage/mumbai-street.jpg',
        previewImage: '/editorImage/mumbai-street.jpg',
        lora: {
            name: 'FashionPhotographyXL.safetensors',
            strength_model: 1,
            strength_clip: 1,
        },
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
        prompt:
            '(standing in front, in the middle of mumbai street, aestheically pleasing, vehicles moving on both sides, street vendors visible at far distance), sunny day, vibrant atmosphere, good shadows,',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    {
        id: 123,
        label: 'Living Room',
        image: '/editorImage/living-room.avif',
        previewImage: '/editorImage/living-room.avif',
        lora: {
            name: 'Rosenl_White minimalist style living room.safetensors',
            strength_model: 1,
            strength_clip: 1,
        },
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            '(traditional living room, ((standing on the floor)), spacious living area, tiny houseplant, elegant coffee table, casual living room, mid-century modern furniture, stylish furnishings, abstract paintings, plush couch, abstract paintings, bookshelf, large windows, decorative vase, abstract art on walls,  glass coffee table),',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    // {
    //   id: 127,
    //   label: 'Hills',
    //   image: '/editorImage/snowy.png',
    //   previewImage: '/editorImage/snowy.png',
    //   lora: {
    //     name: 'snowy_lanscapes.safetensors',
    //     strength_model: 1,
    //     strength_clip: 1,
    //   },
    //   prompt:
    //     '(snowy landscapes, standing in long grass, <lora:snowy_lanscapes:1>, snowy hills, outdoors, no humans, scenery, clean sky, masterpiece), golden hour, consistent lighting, shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer, Vogue magazine style, fashion photography, sharp focus, RAW, trending on Instagram, detailed, balanced contrast, lora:ZStyle_-_Photography_Style:0.5, <lora:Cinematic Film:0.5>, lora:add-detail-xl:1.0, <lora:Perfect Hands v2:1.0>, (Proper white balance), (Shutter Speed 1/350s), blurry background, depth of field',
    //   negativePrompt:
    //     'snowing, ((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    // },
    {
        id: 128,
        label: 'Snowy Mountains',
        image: '/editorImage/snowy_alps.png',
        previewImage: '/editorImage/snowy_alps.png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
        prompt:
            '(standing on snowy mountain trails, serene backdrop, snow-blanketed mountains, a crystal-clear sky, gentle contours of the landscape highlighted by the soft glow of a winter sun),sunny day, vibrant atmosphere, good shadows,',
        negativePrompt:
            'snowing, ((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    {
        id: 137668,
        label: 'Monochrome',
        image: '/editorImage/monochrome.jpeg',
        previewImage: '/editorImage/monochrome.jpeg',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
        prompt:
            '(standing in front of 2 step wide stairs of a white monochromatic architecture with wide arches, bold shapes, Chizuko Yoshida), good shadows,',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare'
    },
    {
        id: 1211,
        label: 'Studio',
        image: '/editorImage/studio.jpeg',
        previewImage: '/editorImage/studio.jpeg',
        lora: {
            name: 'Rosenl_White minimalist style living room.safetensors',
            strength_model: 1,
            strength_clip: 1,
        },
        loraPrompt: '',
        prompt:
            // '(ecommerce fashion imagery, shot in fashion photoshoot studio, beige white seamless backdrop, soft shadows), <lora:Perfect Hands v2:1.0>, post production, vogue magazine cover, good ratios, good proportion of elements, good composition, f2, 35mm, soft light',
            // '(posing in a premium studio setup for fashion photography, ((standing on the floor)), ((solid beige wall behind)), ((minimalistic wooden chair ((nearby)) the model))), high resolution, realistic, cinematic lighting, elegant composition, fashion photography style, by top photographers, 6k resolution',
            '(standing, solid beige seamless backdrop, fashion photography portrait shot, (minimalist decor: 1.2)), shot on DSLR, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, studio lighting, professional photographer, Vogue magazine style, blurry background, depth of field, fashion photography, balanced contrast',
        negativePrompt:
            'detailed shadows, studio equipment, seams, wall seams, objects, shadows, ((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    {
        id: 129,
        label: 'New York',
        image: '/editorImage/new_york.png',
        previewImage: '/editorImage/new_york.png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
        prompt:
            '(standing in the middle of the street, vintage lamposts, bustling New York avenue, skyscrapers, pedestrian crossing signs, near Times Square, overcast sky, stylish footwear, urban setting), sunny day, vibrant atmosphere, good shadows,',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare'
    },
    // {
    //   id: 1322,
    //   label: 'Beach',
    //   image: '/editorImage/beach.jpeg',
    //   previewImage: '/editorImage/beach.jpeg',
    //   prompt:
    //     '(standing on sand, in a serene beach setting with gentle waves lapping at the shore, the glow of a rising sun casting soft light and long shadows on cliffs), vibrant atmosphere, good shadows, <lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
    //   negativePrompt:
    //     '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare'
    // },
    {
        id: 132345,
        label: 'Prague',
        image: '/editorImage/prague.png',
        previewImage: '/editorImage/prague.png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
        prompt:
            '(standing on a cobblestone street with a lamp post and a white building in the background with a tree in the foreground, aestheticism, a stock photo, city background, Florence Engelbach), white light atmosphere, good shadows, soft shadows, ((balanced contrast)),',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare'
    },
    // {
    //     id: 12001,
    //     label: 'France Street',
    //     image: '/editorImage/Untitled.png',
    //     previewImage: '/editorImage/Untitled.png',
    //     loraPrompt:
    //         '',
    //     prompt:
    //         '(street in the old town in France, seen from the front with a cobblestone road and buildings made of white stone with wooden doors)',
    //     negativePrompt:
    //         ''
    // },
    // {
    //     id: 12002,
    //     label: 'Balcony',
    //     image: '/editorImage/Untitled (1).png',
    //     previewImage: '/editorImage/Untitled (1).png',
    //     loraPrompt:
    //         '',
    //     prompt:
    //         ' (standing on a balcony, stunning environment, ultra realistic, elegant, ((intricate)), ((highly detailed)), depth of field, (((professionally color graded))), 8k, 85mm, f/1. 8)',
    //     negativePrompt:
    //         ''
    // },
    // {
    //     id: 12003,
    //     label: 'Baby Shower',
    //     image: '/editorImage/Untitled (2).png',
    //     previewImage: '/editorImage/Untitled (2).png',
    //     loraPrompt:
    //         '',
    //     prompt:
    //         '(a table topped with pink and white balloons, teal aesthetic, bubbles, tiled, ultradetailed, clean composition, minimalitic)',
    //     negativePrompt:
    //         ''
    // },
    // {
    //     id: 12004,
    //     label: 'Forest',
    //     image: '/editorImage/Untitled (3).png',
    //     previewImage: '/editorImage/Untitled (3).png',
    //     loraPrompt:
    //         '',
    //     prompt:
    //         '(in the forest Background, dynamic pose, realistic, glow, detailed textures, high quality, high resolution, high precision, realism, proper lighting settings, harmonious composition, sharp focus)',
    //     negativePrompt:
    //         ''
    // },
    {
        id: 12005,
        label: 'Book Shelf',
        image: '/editorImage/Untitled (4).png',
        previewImage: '/editorImage/Untitled (4).png',
        loraPrompt:
            ' <lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            '(well-loved books, vintage finds:1.1), (vintage rug, warm throws:1.1), (collected books, antique treasures:1.1), (open shelving, contemporary art:1.1), (sleek furnishings, clean lines:1.1), (stylish simplicity, airy atmosphere:1.1), (tastefully arranged books:1.3, art objects:1.1), (upscale elegance, modern appeal:1.1), (modern white living room) shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer,',
        negativePrompt:
            'wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    },
    {
        id: 12006,
        label: 'Meadow',
        image: '/editorImage/Untitled (6).png',
        previewImage: '/editorImage/Untitled (6).png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            '(idyllic country meadow:1.3), (sun-dappled grass, blooming wildflowers:1.1), (tranquil pond, grazing:1.1), (peaceful retreat, rural charm:1.1), shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer,',
        negativePrompt:
            'wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    },
    {
        id: 12007,
        label: 'Concrete wall',
        image: '/editorImage/img-product.png',
        previewImage: '/editorImage/img-product.png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            'in a Concrete Wall: Fading paint, path way, stones,  greenery visible, shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer,',
        negativePrompt:
            'high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    },
    {
        id: 12008,
        label: 'Mountain',
        image: '/editorImage/img-product (1).png',
        previewImage: '/editorImage/img-product (1).png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            `(in a Mountain Overlook, Scenic vista, towering summits, verdant woodlands: 1.2), (Expansive panorama, tranquil serenity, distant peaks: 1.1), (Sun-kissed landscape, elongated shadows, breathtaking scenery: 1.1), (Majestic tranquility, horizon's expanse, nature: 1.1) shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer,`,
        negativePrompt:
            'wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    },
    {
        id: 12009,
        label: 'City Park',
        image: '/editorImage/img-product (2).png',
        previewImage: '/editorImage/img-product (2).png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            `(in a City Park,  Lush greenery, blooming flowers, towering trees: 1.2), (Winding paths, park benches, serene pond: 1.1), (urban oasis, nature's beauty: 1.1)shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer, `,
        negativePrompt:
            'wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    },
    {
        id: 12010,
        label: 'Modern Office',
        image: '/editorImage/img-product (3).png',
        previewImage: '/editorImage/img-product (3).png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            `(in a Modern Office Space, Glass walls, minimalist decor, ergonomic furniture: 1.2), (Natural light, clean workstations, trendy setups: 1.1), (Contemporary work environment, productivity, professional ambiance: 1.1) shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer,`,
        negativePrompt:
            'wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    },
    {
        id: 12011,
        label: 'Luxurious Villa',
        image: '/editorImage/img-product (4).png',
        previewImage: '/editorImage/img-product (4).png',
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            '(In Front of Luxurious Villa, Picturesque setting, elegant backdrop, serene ambiance: 1.2), (Manicured gardens, shimmering pool, grand architecture: 1.1), (Chic outdoor spaces, sophisticated retreat, peaceful oasis: 1.1), (Luxury at its finest, opulent view, refined: 1.1), shot on dslr, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, professional photographer,',
        negativePrompt:
            'wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck'
    },
];

export const brushnetTemplates = [
    {
        id: 10,
        label: 'City Night',
        image: '/editorImage/city-night.jpeg',
        previewImage: '/editorImage/city-night.jpeg',
        loraPrompt:
            '',
        prompt:
            '((On a bustling nighttime rue illuminated by neon lights)), ((featuring a vibrant atmosphere of city life with Parisian charm and nocturnal elegance)).',
        negativePrompt:
            'ugly, low quality, people in background, low resolution, ',
    },
    {
        id: 124,
        label: 'Cafe',
        image: '/editorImage/cafe.jpg',
        previewImage: '/editorImage/cafe.jpg',
        // lora: {
        //   name: 'FashionPhotographyXL.safetensors',
        //   strength_model: 0.5,
        //   strength_clip: 0.5,
        // },
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
        prompt:
            '(standing in middle of a european street, beautiful cafe visible on the sidewalk, canopy, sunny day, modern aestheically pleasing cafe, cafe lights, sunny day),',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    {
        id: 1234,
        label: 'Mumbai Street',
        image: '/editorImage/mumbai-street.jpg',
        previewImage: '/editorImage/mumbai-street.jpg',
        lora: {
            name: 'FashionPhotographyXL.safetensors',
            strength_model: 1,
            strength_clip: 1,
        },
        loraPrompt:
            '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
        prompt:
            '(standing in front, in the middle of mumbai street, aestheically pleasing, vehicles moving on both sides, street vendors visible at far distance), sunny day, vibrant atmosphere, good shadows,',
        negativePrompt:
            '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    },
    // {
    //     id: 124,
    //     label: 'Cafe',
    //     image: '/editorImage/cafe.jpg',
    //     previewImage: '/editorImage/cafe.jpg',
    //     // lora: {
    //     //   name: 'FashionPhotographyXL.safetensors',
    //     //   strength_model: 0.5,
    //     //   strength_clip: 0.5,
    //     // },
    //     loraPrompt:
    //         '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
    //     prompt:
    //         '(standing in middle of a european street, beautiful cafe visible on the sidewalk, canopy, sunny day, modern aestheically pleasing cafe, cafe lights, sunny day),',
    //     negativePrompt:
    //         '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    // },
    // {
    //     id: 1234,
    //     label: 'Mumbai Street',
    //     image: '/editorImage/mumbai-street.jpg',
    //     previewImage: '/editorImage/mumbai-street.jpg',
    //     lora: {
    //         name: 'FashionPhotographyXL.safetensors',
    //         strength_model: 1,
    //         strength_clip: 1,
    //     },
    //     loraPrompt:
    //         '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
    //     prompt:
    //         '(standing in front, in the middle of mumbai street, aestheically pleasing, vehicles moving on both sides, street vendors visible at far distance), sunny day, vibrant atmosphere, good shadows,',
    //     negativePrompt:
    //         '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    // },
    // {
    //     id: 123,
    //     label: 'Living Room',
    //     image: '/editorImage/living-room.avif',
    //     previewImage: '/editorImage/living-room.avif',
    //     lora: {
    //         name: 'Rosenl_White minimalist style living room.safetensors',
    //         strength_model: 1,
    //         strength_clip: 1,
    //     },
    //     loraPrompt:
    //         '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, f/4, ISO 200, 1/100,',
    //     prompt:
    //         '(traditional living room, ((standing on the floor)), spacious living area, tiny houseplant, elegant coffee table, casual living room, mid-century modern furniture, stylish furnishings, abstract paintings, plush couch, abstract paintings, bookshelf, large windows, decorative vase, abstract art on walls,  glass coffee table),',
    //     negativePrompt:
    //         '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    // },
    {
        id: 128,
        label: 'Snow',
        image: '/editorImage/snowy_alps.png',
        previewImage: '/editorImage/snowy_alps.png',
        loraPrompt:
            '',
        prompt:
            '((In a snow-covered alpine landscape, embodying a winter wonderland and mountain majesty)), ((featuring pristine snow and breathtaking scenery that captures the natural beauty and peaceful solitude)).',
        negativePrompt:
            'ugly, low quality',
    },
    {
        id: 1322,
        label: 'Beach',
        image: '/editorImage/beach.jpeg',
        previewImage: '/editorImage/beach.jpeg',
        prompt:
            '((On a pristine beach with natural scenery)), ((featuring a serene ocean retreat along the coastline with untouched beauty)), ((highlighted by sun-kissed sand and coastal elegance)).',
        negativePrompt:
            'ugly, low quality'
    },
    // {
    //     id: 137668,
    //     label: 'Monochrome',
    //     image: '/editorImage/monochrome.jpeg',
    //     previewImage: '/editorImage/monochrome.jpeg',
    //     loraPrompt:
    //         '<lora:Perfect Hands v2:1.0>, good ratios, good proportion of elements, good composition, shot on Canon EOS 5D Mark IV, 24-70mm lens, soft light',
    //     prompt:
    //         '(standing in front of 2 step wide stairs of a white monochromatic architecture with wide arches, bold shapes, Chizuko Yoshida), good shadows,',
    //     negativePrompt:
    //         '((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare'
    // },
    // {
    //     id: 1211,
    //     label: 'Studio',
    //     image: '/editorImage/studio.jpeg',
    //     previewImage: '/editorImage/studio.jpeg',
    //     lora: {
    //         name: 'Rosenl_White minimalist style living room.safetensors',
    //         strength_model: 1,
    //         strength_clip: 1,
    //     },
    //     loraPrompt: '',
    //     prompt:
    //         // '(ecommerce fashion imagery, shot in fashion photoshoot studio, beige white seamless backdrop, soft shadows), <lora:Perfect Hands v2:1.0>, post production, vogue magazine cover, good ratios, good proportion of elements, good composition, f2, 35mm, soft light',
    //         // '(posing in a premium studio setup for fashion photography, ((standing on the floor)), ((solid beige wall behind)), ((minimalistic wooden chair ((nearby)) the model))), high resolution, realistic, cinematic lighting, elegant composition, fashion photography style, by top photographers, 6k resolution',
    //         '(standing, solid beige seamless backdrop, fashion photography portrait shot, (minimalist decor: 1.2)), shot on DSLR, 8k, focus on eyes and clothing, highly realistic, ultra quality, professional photograph, portrait, fashion model, dramatic lighting, studio lighting, professional photographer, Vogue magazine style, blurry background, depth of field, fashion photography, balanced contrast',
    //     negativePrompt:
    //         'detailed shadows, studio equipment, seams, wall seams, objects, shadows, ((bad proportion)), air brush, geometry, jpeg artifacts, bad composition, oversaturated, undersaturated, overexposed, underexposed, grayscale, wall background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,  face blur, light on face, glare, flare',
    // },
    {
        id: 129,
        label: 'New York',
        image: '/editorImage/new_york.png',
        previewImage: '/editorImage/new_york.png',
        loraPrompt:
            '',
        prompt:
            '(neighborhood New York City streets:1.3), (glamorous New York City streets:1.3), (luxury stores, high-end restaurants:1.1), (fashion, elegance:1.1), (local shops, residential buildings:1.1)',
        negativePrompt:
            'ugly, low quality, people in background, low resolution, cars, vehicles'
    },
    {
        id: 123,
        label: 'Living Room',
        image: '/editorImage/living-room.avif',
        previewImage: '/editorImage/living-room.avif',
        loraPrompt:
            '',
        prompt:
            '((In a minimalist living room with a monochromatic palette and sleek furnishings)), ((featuring built-in storage and geometric shapes for a clean, modern look)).',
        negativePrompt:
            'ugly, low quality',
    },
    {
        id: 132345,
        label: 'Prague',
        image: '/editorImage/prague.png',
        previewImage: '/editorImage/prague.png',
        loraPrompt:
            '',
        prompt:
            '(standing on a cobblestone street with a lamp post and a white building in the background with a tree in the foreground, city background, Florence Engelbach),',
        negativePrompt:
            'ugly, low quality'
    },
    // {
    //     id: 12001,
    //     label: 'France Street',
    //     image: '/editorImage/Untitled.png',
    //     previewImage: '/editorImage/Untitled.png',
    //     loraPrompt:
    //         '',
    //     prompt:
    //         '(street in the old town in France, seen from the front with a cobblestone road and buildings made of white stone with wooden doors)',
    //     negativePrompt:
    //         ''
    // },
    {
        id: 12002,
        label: 'Balcony',
        image: '/editorImage/Untitled (1).png',
        previewImage: '/editorImage/Untitled (1).png',
        loraPrompt:
            '',
        prompt:
            '(standing on a balcony, stunning environment, ultra realistic, elegant, ((intricate)), ((highly detailed)), depth of field, (((professionally color graded))), 8k, ',
        negativePrompt:
            'ugly, low quality'
    },
    {
        id: 12003,
        label: 'Baby Shower',
        image: '/editorImage/Untitled (2).png',
        previewImage: '/editorImage/Untitled (2).png',
        loraPrompt:
            '',
        prompt:
            '((A clean, minimalistic composition)), ((featuring a tiled teal backdrop topped with pink and white balloons)), ((accentuated with ultra detailed bubbles for a playful touch))',
        negativePrompt:
            'ugly, low quality'
    },
    {
        id: 12004,
        label: 'Forest',
        image: '/editorImage/Untitled (3).png',
        previewImage: '/editorImage/Untitled (3).png',
        loraPrompt:
            '',
        prompt:
            '((In a forest with realistic, detailed textures and harmonious composition)), ((under proper lighting settings, showcasing high precision and sharp focus)), ((captured in high resolution for high-quality realism)).',
        negativePrompt:
            'ugly, low quality'
    },
    {
        id: 12005,
        label: 'Book Shelf',
        image: '/editorImage/Untitled (4).png',
        previewImage: '/editorImage/Untitled (4).png',
        loraPrompt:
            '',
        prompt:
            '(Beside a wooden bookshelf in a sunlit white room, with a window casting soft light and a touch of green nearby)',
        negativePrompt:
            'ugly, low quality'
    },
    {
        id: 12006,
        label: 'Wooden',
        image: '/editorImage/Untitled (5).png',
        previewImage: '/editorImage/Untitled (5).png',
        loraPrompt:
            '',
        prompt:
            '(window, background, wooden interior, relaxing environment, cabin lights, wooden cottage)',
        negativePrompt:
            'ugly, low quality'
    },
];



export const ootdModelTemplateList = [
    // {
    //     id: 1,
    //     label: '',
    //     image: '/ootd/1.png',
    //     previewImage: '/ootd/1.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 2,
    //     label: '',
    //     image: '/ootd/2.png',
    //     previewImage: '/ootd/2.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 3,
    //     label: '',
    //     image: '/ootd/3.png',
    //     previewImage: '/ootd/3.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 4,
    //     label: '',
    //     image: '/ootd/4.png',
    //     previewImage: '/ootd/4.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 5,
    //     label: '',
    //     image: '/ootd/5.png',
    //     previewImage: '/ootd/5.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 6,
    //     label: '',
    //     image: '/ootd/6.png',
    //     previewImage: '/ootd/6.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 7,
    //     label: '',
    //     image: '/ootd/7.png',
    //     previewImage: '/ootd/7.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 8,
    //     label: '',
    //     image: '/ootd/8.png',
    //     previewImage: '/ootd/8.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 9,
    //     label: '',
    //     image: '/ootd/9.png',
    //     previewImage: '/ootd/9.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 10,
    //     label: '',
    //     image: '/ootd/10.png',
    //     previewImage: '/ootd/10.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 11,
    //     label: '',
    //     image: '/ootd/11.png',
    //     previewImage: '/ootd/11.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 12,
    //     label: '',
    //     image: '/ootd/12.png',
    //     previewImage: '/ootd/12.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 13,
    //     label: '',
    //     image: '/ootd/13.png',
    //     previewImage: '/ootd/13.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    // {
    //     id: 14,
    //     label: '',
    //     image: '/ootd/14.png',
    //     previewImage: '/ootd/14.png',
    //     prompt: '',
    //     negativePrompt: '',
    // },
    {
        id: 15,
        label: '',
        image: '/ootd/15.png',
        previewImage: '/ootd/15.png',
        prompt: '',
        negativePrompt: '',
    },
    {
        id: 16,
        label: '',
        image: '/ootd/16.jpeg',
        previewImage: '/ootd/16.jpeg',
        prompt: '',
        negativePrompt: '',
    },
    {
        id: 17,
        label: '',
        image: '/ootd/17.jpeg',
        previewImage: '/ootd/17.jpeg',
        prompt: '',
        negativePrompt: '',
    },
    {
        id: 18,
        label: '',
        image: '/ootd/18.jpeg',
        previewImage: '/ootd/18.jpeg',
        prompt: '',
        negativePrompt: '',
    },
    {
        id: 19,
        label: '',
        image: '/ootd/19.jpeg',
        previewImage: '/ootd/19.jpeg',
        prompt: '',
        negativePrompt: '',
    },
    {
        id: 20,
        label: '',
        image: '/ootd/20.jpeg',
        previewImage: '/ootd/20.jpeg',
        prompt: '',
        negativePrompt: '',
    },
    {
        id: 21,
        label: '',
        image: '/ootd/21.jpeg',
        previewImage: '/ootd/21.jpeg',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
    {
        id: 22,
        label: '',
        image: '/ootd/22.png',
        previewImage: '/ootd/22.png',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
    {
        id: 23,
        label: '',
        image: '/ootd/23.jpeg',
        previewImage: '/ootd/23.jpeg',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
    {
        id: 24,
        label: '',
        image: '/ootd/24.jpeg',
        previewImage: '/ootd/24.jpeg',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
    {
        id: 25,
        label: '',
        image: '/ootd/25.jpeg',
        previewImage: '/ootd/25.jpeg',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
    {
        id: 26,
        label: '',
        image: '/ootd/26.jpeg',
        previewImage: '/ootd/26.jpeg',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
    {
        id: 27,
        label: '',
        image: '/ootd/27.jpeg',
        previewImage: '/ootd/27.jpeg',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
    {
        id: 28,
        label: '',
        image: '/ootd/28.jpeg',
        previewImage: '/ootd/28.jpeg',
        prompt: '',
        negativePrompt: '',
        category: "dresses"
    },
];