from transformers import AutoModelForCausalLM, AutoTokenizer
import torch



def translate(description, lang):
    model = AutoModelForCausalLM.from_pretrained(
    "Telugu-LLM-Labs/Indic-gemma-7b-finetuned-sft-Navarasa-2.0",
    load_in_4bit = False,
    # token = hf_token
    )
    model.to("cuda")
    
    tokenizer = AutoTokenizer.from_pretrained("Telugu-LLM-Labs/Indic-gemma-7b-finetuned-sft-Navarasa-2.0")
    input_prompt = """
    ### Instruction:
    {}
    
    ### Input:
    {}
    
    ### Response:
    {}"""
    
    input_text = input_prompt.format(
            "Translate the following paragraph to " + lang, # instruction
            description, # input
            "", # output - leave this blank for generation!
        )
    
    inputs = tokenizer([input_text], return_tensors = "pt").to("cuda")
    
    outputs = model.generate(**inputs, max_new_tokens = 2000, use_cache = True)
    response = tokenizer.batch_decode(outputs)[0]
    print(response)
    # start_index = input_text.find("### Response:") + len("### Response:")
    # end_index = input_text.find("<eos>", start_index)
    # output_content = input_text[start_index:-1].strip()
    outputs = response.split("###")
    outputs = outputs[-1]
    outputs = outputs[10:-5]
    # remove extra spaces
    outputs = outputs.strip()
    print(outputs)
    return outputs
   # print(response)
   # return response
